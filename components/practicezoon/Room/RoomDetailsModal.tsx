import React, { useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '../../common/Modal';
import { Users, Globe2, Crown, DoorOpen, ArrowLeft } from 'lucide-react';
import { RoomType } from '@/types/room';
import { useAddRoomMemberMutation } from '@/libs/features/room/roomApiSlice';
import { getSocket } from '@/libs/socket';
import { useAppSelector } from "@/libs/hooks";
import { useAudio } from '@/context/AudioContext';
import Image from 'next/image';

const mockRoom: RoomType = {
  id: "1",
  title: "English Conversation Practice",
  description: "Let's practice everyday English conversation! All levels welcome.",
  language: "English",
  level: "Intermediate",
  maxParticipants: 6,
  hostId: "5",
  status: "active",
  createdAt: new Date().toISOString(),
  members: [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
    {
      id: "2",
      name: "Miguel Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: "3",
      name: "Yuki Tanaka",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
    {
      id: "4",
      name: "Hans Weber",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    }
  ]
};

// Store peers outside component to persist across renders
const peers: { [id: string]: RTCPeerConnection } = {};
const remoteAudioElements: { [id: string]: HTMLAudioElement } = {};

export default function RoomDetailsModal({ 
  isOpen, 
  onClose, 
  handleUserJoined, 
  handleUserLeft 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  handleUserJoined: (data: { user: { id: string, name: string } }) => void, 
  handleUserLeft: (data: { memberId: string }) => void 
}) {
  const [addRoomMember, { isLoading }] = useAddRoomMemberMutation();
  const currentUser = useAppSelector(state => state.auth.user);
  const room = mockRoom;
  const router = useRouter();
  const { id } = useParams();
  const roomId = Array.isArray(id) ? id[0] : id;
  const hasJoinedRoom = useRef(false);
  
  // Use the audio context hook
  const { startAudio, stopAudio, localStreamRef } = useAudio();

  const socket = getSocket();

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  // Create peer connection with ICE servers
  const createPeerConnection = useCallback((socketId: string, stream: MediaStream | null) => {
    if (peers[socketId]) return peers[socketId];
    
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    const pc = new RTCPeerConnection(configuration);

    // Only add tracks if stream exists (user has unmuted and has microphone)
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }

    pc.ontrack = (event) => {
      console.log('Received remote track from', socketId);
      const audio = document.createElement("audio");
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      audio.id = `audio-${socketId}`;
      document.body.appendChild(audio);
      remoteAudioElements[socketId] = audio;
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", { to: socketId, candidate: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Peer connection state with ${socketId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.log(`Connection ${pc.connectionState} with ${socketId}`);
      }
    };

    peers[socketId] = pc;
    return pc;
  }, [socket]);

  // Cleanup peer connection
  const cleanupPeerConnection = useCallback((socketId: string) => {
    if (peers[socketId]) {
      peers[socketId].close();
      delete peers[socketId];
    }

    if (remoteAudioElements[socketId]) {
      const stream = remoteAudioElements[socketId].srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      if (remoteAudioElements[socketId].parentNode) {
        document.body.removeChild(remoteAudioElements[socketId]);
      }
      delete remoteAudioElements[socketId];
    }
  }, []);

  const joinRoomHandler = async () => {
    if (!roomId) {
      toast.error('Room ID is missing.');
      return;
    }

    if (!currentUser?.id) {
      toast.error('User not authenticated.');
      return;
    }

    const joinPromise = addRoomMember(roomId).unwrap();

    toast.promise(
      joinPromise,
      {
        loading: 'Joining room...',
        success: 'You joined the room!',
        error: (err: {
          data?: { success?: boolean; error?: string };
          status?: number;
        }): string => {
          return err?.data?.error || 'Failed to join room.';
        },
      }
    );

    try {
      await joinPromise;
      hasJoinedRoom.current = true;

      // Start audio (muted by default, no microphone access yet)
      await startAudio(currentUser.id, roomId);

      // Emit join-room event
      socket?.emit('join-room', {
        roomId,
        user: {
          id: currentUser.id,
          name: currentUser.fullName
        },
      });

      onClose();
    } catch (error) {
      console.error('Join room failed:', error);
      hasJoinedRoom.current = false;
    }
  };

  // Handle user-joined and user-left events
  useEffect(() => {
    if (!socket || !roomId || !hasJoinedRoom.current) return;

    const handleUserJoinedEvent = async ({ user, socketId }: { user: { id: string, name: string }, socketId: string }) => {
      console.log('User joined:', user.name, socketId);
      handleUserJoined({ user });
      
      if (socketId === socket.id) return;

      // Create peer connection - even if we don't have a stream yet
      // The stream can be added later when user unmutes
      const pc = createPeerConnection(socketId, localStreamRef.current);

      // Only send offer if we have a local stream (user has unmuted)
      if (localStreamRef.current) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: socketId, offer });
      } else {
        // If no stream yet, we'll renegotiate when user unmutes
        console.log('User joined but local stream not available yet (still muted)');
      }
    };

    const handleUserLeftEvent = ({ memberId, socketId }: { memberId: string, socketId: string }) => {
      console.log('User left:', memberId, socketId);
      handleUserLeft({ memberId });
      cleanupPeerConnection(socketId);
    };

    socket.on("user-joined", handleUserJoinedEvent);
    socket.on("user-left", handleUserLeftEvent);

    return () => {
      socket.off("user-joined", handleUserJoinedEvent);
      socket.off("user-left", handleUserLeftEvent);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, roomId, hasJoinedRoom.current, localStreamRef, createPeerConnection, cleanupPeerConnection, handleUserJoined, handleUserLeft]);

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket || !roomId || !hasJoinedRoom.current) return;

    const handleOffer = async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
      console.log('Received offer from:', from);
      let pc = peers[from];
      if (!pc) {
        pc = createPeerConnection(from, localStreamRef.current);
      }

      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      }
    };

    const handleAnswer = async ({ from, answer }: { from: string, answer: RTCSessionDescriptionInit }) => {
      console.log('Received answer from:', from);
      const pc = peers[from];
      if (pc && pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidate = async ({ from, candidate }: { from: string, candidate: RTCIceCandidateInit }) => {
      const pc = peers[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, roomId, hasJoinedRoom.current, localStreamRef, createPeerConnection]);

  // Watch for localStreamRef changes (when user unmutes and gets microphone)
  useEffect(() => {
    if (!socket || !roomId || !hasJoinedRoom.current) return;
    if (!localStreamRef.current) return;

    console.log('Local stream became available, renegotiating with all peers');

    // When user unmutes and microphone becomes available, renegotiate with all existing peers
    const renegotiateWithPeers = async () => {
      for (const socketId of Object.keys(peers)) {
        const pc = peers[socketId];
        
        // Add new tracks to existing peer connection
        localStreamRef.current?.getTracks().forEach(track => {
          const senders = pc.getSenders();
          const trackExists = senders.some(sender => sender.track === track);
          if (!trackExists) {
            pc.addTrack(track, localStreamRef.current!);
          }
        });

        // Create new offer with audio track
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { to: socketId, offer });
          console.log('Sent renegotiation offer to', socketId);
        } catch (error) {
          console.error('Failed to renegotiate with', socketId, error);
        }
      }
    };

    renegotiateWithPeers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStreamRef.current, socket, roomId, hasJoinedRoom.current]);

  // Cleanup on unmount - DON'T stop audio if user joined (they're going to RoomLayout)
  useEffect(() => {
    return () => {
      // Only cleanup if user didn't join (e.g., closed modal without joining)
      if (!hasJoinedRoom.current && currentUser?.id) {
        stopAudio(currentUser.id);
        Object.keys(peers).forEach(socketId => {
          cleanupPeerConnection(socketId);
        });
      }
    };
  }, [stopAudio, currentUser?.id, cleanupPeerConnection]);

  const handleBackToHome = () => {
    if (currentUser?.id) {
      stopAudio(currentUser.id);
    }
    
    // Clean up all peer connections
    Object.keys(peers).forEach(socketId => {
      cleanupPeerConnection(socketId);
    });
    
    router.push(`/practicezoon`);
  }

  if (isOpen) {
    return null;
  }

  return (
    <Modal>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm px-4 py-1.5 rounded-full border ${levelColors[room.level]}`}>
                    {room.level}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-1.5 rounded-full">
                    <Globe2 size={16} />
                    {room.language}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-4 py-1.5 rounded-full">
                    <Users size={16} />
                    2/{room.maxParticipants}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{room.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-500/90 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={joinRoomHandler}
                >
                  <DoorOpen size={20} />
                  {isLoading ? 'Joining...' : 'Join Room'}
                </button>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <Image
                      src={member.avatar || ""}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                        {member.id === room.hostId && (
                          <Crown size={16} className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8">
              <button
                onClick={handleBackToHome}
                className="bg-red-500/90 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={20} /> <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}