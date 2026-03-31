// context/AudioContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import {
  setAudioEnabled,
  setMuted,
  setSpeakingUser,
  removeSpeakingUser,
} from "@/libs/features/room/roomSlice";
import toast from "react-hot-toast";
import { socketManager } from "@/libs/socket/index";

type AudioContextType = {
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  isMuted: boolean;
  isAudioEnabled: boolean;
  startAudio: (userId: string, roomId: string) => Promise<MediaStream | null>;
  stopAudio: (userId: string) => void;
  toggleMute: (roomId: string, userId: string) => void;
};

const AudioCtx = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((s) => s.room.isMuted);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const wasSpeakingRef = useRef(false);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRoomIdRef = useRef<string>("");
  const currentUserIdRef = useRef<string>("");

  // ── Speaking detection ──────────────────────────────────────────────────────
  const initializeAudioDetection = (
    stream: MediaStream,
    userId: string,
    roomId: string
  ) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const analyser = ctx.createAnalyser();
      ctx.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detect = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        const enabled = track?.enabled ?? false;

        if (enabled) {
          analyser.getByteFrequencyData(dataArray);
          const volume =
            dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          const speaking = volume > 25;

          if (speaking && !wasSpeakingRef.current) {
            wasSpeakingRef.current = true;
            dispatch(setSpeakingUser(userId));
            socketManager.emit("user-speaking", {
              roomId,
              userId,
              speaking: true,
            });
          } else if (!speaking && wasSpeakingRef.current) {
            if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
            stopTimeoutRef.current = setTimeout(() => {
              wasSpeakingRef.current = false;
              dispatch(removeSpeakingUser(userId));
              socketManager.emit("user-speaking", {
                roomId,
                userId,
                speaking: false,
              });
            }, 500);
          }
        } else if (wasSpeakingRef.current) {
          wasSpeakingRef.current = false;
          dispatch(removeSpeakingUser(userId));
          socketManager.emit("user-speaking", {
            roomId,
            userId,
            speaking: false,
          });
        }

        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    } catch (err) {
      console.error("[AudioContext] Failed to initialize audio detection:", err);
    }
  };

  // ── startAudio ──────────────────────────────────────────────────────────────
  const startAudio = async (
    userId: string,
    roomId: string
  ): Promise<MediaStream | null> => {
    currentRoomIdRef.current = roomId;
    currentUserIdRef.current = userId;
    setIsAudioEnabled(true);
    dispatch(setAudioEnabled(true));
    dispatch(setMuted(true));
    toast.success("Joined room (microphone muted by default)");
    return null;
  };

  // ── requestMicrophoneAccess (internal) ──────────────────────────────────────
  const requestMicrophoneAccess = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const track = stream.getAudioTracks()[0];
      if (track) track.enabled = true;
      localStreamRef.current = stream;
      initializeAudioDetection(
        stream,
        currentUserIdRef.current,
        currentRoomIdRef.current
      );
      return stream;
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "NotFoundError")
          toast.error("No microphone found. Please connect a microphone.");
        else if (err.name === "NotAllowedError")
          toast.error("Microphone access denied.");
        else if (err.name === "NotReadableError")
          toast.error("Microphone is already in use by another application.");
        else toast.error("Failed to access microphone.");
      } else {
        toast.error("Failed to access microphone.");
      }
      throw err;
    }
  };

  // ── stopAudio ───────────────────────────────────────────────────────────────
  const stopAudio = (userId: string) => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setIsAudioEnabled(false);
    dispatch(setAudioEnabled(false));
    dispatch(removeSpeakingUser(userId));

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    wasSpeakingRef.current = false;
    currentRoomIdRef.current = "";
    currentUserIdRef.current = "";
  };

  // ── toggleMute ──────────────────────────────────────────────────────────────
  const toggleMute = async (roomId: string, userId: string) => {
    if (isMuted) {
      if (!localStreamRef.current) {
        try {
          const stream = await requestMicrophoneAccess();
          if (!stream) return;
          dispatch(setMuted(false));
          socketManager.emit("user-mute-status", { roomId, userId, isMuted: false });
          toast.success("Microphone unmuted");
        } catch {
          dispatch(setMuted(true));
        }
      } else {
        const track = localStreamRef.current.getAudioTracks()[0];
        if (track) {
          track.enabled = true;
          dispatch(setMuted(false));
          socketManager.emit("user-mute-status", { roomId, userId, isMuted: false });
          toast.success("Microphone unmuted");
        }
      }
    } else {
      const track = localStreamRef.current?.getAudioTracks()[0];
      if (track) {
        track.enabled = false;
        dispatch(setMuted(true));
        socketManager.emit("user-mute-status", { roomId, userId, isMuted: true });
        dispatch(removeSpeakingUser(userId));
        socketManager.emit("user-speaking", { roomId, userId, speaking: false });
        toast.success("Microphone muted");
      }
    }
  };

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = socketManager.on("user-mute-status", (payload: unknown) => {
      const { userId, isMuted } = payload as { userId: string; isMuted: boolean };
      console.log(`[Audio] User ${userId} is now ${isMuted ? "muted" : "unmuted"}`);
    });

    return () => {
      unsub();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (audioContextRef.current?.state !== "closed")
        audioContextRef.current?.close();
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        localStreamRef,
        isMuted,
        isAudioEnabled,
        startAudio,
        stopAudio,
        toggleMute,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
};