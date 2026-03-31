// hooks/useRoomSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { socketManager } from "@/libs/socket/index";
import { PeerManager } from "@/libs/webrtc/PeerManager";
import { useAudio } from "@/context/AudioContext";

export interface RoomUser {
  id: string;
  name: string;
}

export interface UseRoomSocketOptions {
  roomId: string | undefined;
  currentUserId: string | undefined;
  currentUserName?: string | undefined;
  onUserJoined?: (data: { user: RoomUser; socketId: string }) => void;
  onUserLeft?: (data: { memberId: string; socketId: string }) => void;
}

export interface UseRoomSocketReturn {
  joinRoom: () => Promise<void>;
  leaveRoom: () => void;
  hasJoined: boolean;
}

export function useRoomSocket({
  roomId,
  currentUserId,
  currentUserName,
  onUserJoined,
  onUserLeft,
}: UseRoomSocketOptions): UseRoomSocketReturn {
  const { startAudio, stopAudio, localStreamRef } = useAudio();
  const hasJoinedRef = useRef(false);
  // One PeerManager instance per room session — created on join, destroyed on leave
  const peerManagerRef = useRef<PeerManager | null>(null);

  // ── Join ────────────────────────────────────────────────────────────────────
  const joinRoom = useCallback(async () => {
    if (!roomId || !currentUserId) return;

    peerManagerRef.current = new PeerManager(roomId);
    hasJoinedRef.current = true;

    await startAudio(currentUserId, roomId);

    socketManager.emit("join-room", {
      roomId,
      user: { id: currentUserId, name: currentUserName },
    });
  }, [roomId, currentUserId, currentUserName, startAudio]);

  // ── Leave ───────────────────────────────────────────────────────────────────
  const leaveRoom = useCallback(() => {
    if (!roomId || !currentUserId) return;

    socketManager.emit("leave-room", { roomId, memberId: currentUserId });
    stopAudio(currentUserId);
    peerManagerRef.current?.closeAll();
    peerManagerRef.current = null;
    hasJoinedRef.current = false;
  }, [roomId, currentUserId, stopAudio]);

  // ── user-joined / user-left ─────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;

    const unsubJoined = socketManager.on(
      "user-joined",
      async (payload: unknown) => {
        const { user, socketId } = payload as { user: RoomUser; socketId: string };
        onUserJoined?.({ user, socketId });

        if (!peerManagerRef.current) return;
        const socket = socketManager.getSocket();
        if (socketId === socket?.id) return;

        const pc = peerManagerRef.current.createConnection(
          socketId,
          localStreamRef.current
        );

        if (localStreamRef.current) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketManager.emit("offer", { to: socketId, offer });
        }
      }
    );

    const unsubLeft = socketManager.on(
      "user-left",
      (payload: unknown) => {
        const { memberId, socketId } = payload as {
          memberId: string;
          socketId: string;
        };
        onUserLeft?.({ memberId, socketId });
        peerManagerRef.current?.closeConnection(socketId);
      }
    );

    return () => {
      unsubJoined();
      unsubLeft();
    };
  }, [roomId, onUserJoined, onUserLeft, localStreamRef]);

  // ── WebRTC signaling ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!roomId) return;

    const unsubOffer = socketManager.on(
      "offer",
      async (payload: unknown) => {
        const { from, offer } = payload as {
          from: string;
          offer: RTCSessionDescriptionInit;
        };
        await peerManagerRef.current?.handleOffer(
          from,
          offer,
          localStreamRef.current
        );
      }
    );

    const unsubAnswer = socketManager.on(
      "answer",
      async (payload: unknown) => {
        const { from, answer } = payload as {
          from: string;
          answer: RTCSessionDescriptionInit;
        };
        await peerManagerRef.current?.handleAnswer(from, answer);
      }
    );

    const unsubIce = socketManager.on(
      "ice-candidate",
      async (payload: unknown) => {
        const { from, candidate } = payload as {
          from: string;
          candidate: RTCIceCandidateInit;
        };
        await peerManagerRef.current?.handleIceCandidate(from, candidate);
      }
    );

    return () => {
      unsubOffer();
      unsubAnswer();
      unsubIce();
    };
  }, [roomId, localStreamRef]);

  // ── Renegotiate when local stream appears (user unmuted) ────────────────────
  useEffect(() => {
    if (!localStreamRef.current || !hasJoinedRef.current) return;
    if (!peerManagerRef.current) return;
    peerManagerRef.current.renegotiateAll(localStreamRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStreamRef.current]);

  // ── Cleanup if modal closed without joining ─────────────────────────────────
  useEffect(() => {
    return () => {
      if (!hasJoinedRef.current) {
        if (currentUserId) stopAudio(currentUserId);
        peerManagerRef.current?.closeAll();
        peerManagerRef.current = null;
      }
    };
  }, [currentUserId, stopAudio]);

  return {
    joinRoom,
    leaveRoom,
    hasJoined: hasJoinedRef.current,
  };
}