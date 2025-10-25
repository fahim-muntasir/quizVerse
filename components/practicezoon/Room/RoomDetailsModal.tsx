import React, { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '../../common/Modal';
import { Users, Globe2, Crown, DoorOpen, ArrowLeft } from 'lucide-react';
import { RoomType } from '@/types/room';
import { useAddRoomMemberMutation } from '@/libs/features/room/roomApiSlice';
import { getSocket } from '@/libs/socket';
import { useAppSelector } from "@/libs/hooks";
import { useAudio } from '@/context/AudioContext';

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

const peers: { [id: string]: RTCPeerConnection } = {};
const remoteAudioElements: { [id: string]: HTMLAudioElement } = {};

export default function RoomDetailsModal({ isOpen, onClose, handleUserJoined, handleUserLeft }: { isOpen: boolean, onClose: () => void, handleUserJoined: (data: { user: { id: string, name: string } }) => void, handleUserLeft: (data: { memberId: string }) => void }) {
  const [addRoomMember, { isLoading }] = useAddRoomMemberMutation();
  const currentUser = useAppSelector(state => state.auth.user);
  const room = mockRoom;
  const router = useRouter();
  const { id } = useParams();
  const roomId = Array.isArray(id) ? id[0] : id;
  // const localStreamRef = useRef<MediaStream | null>(null);
  const hasJoinedRoom = useRef(false);
  // const { startAudio, stopAudio, localStreamRef} = useAudioStream(currentUser?.id);
  const { startAudio, stopAudio, localStreamRef} = useAudio();

  const socket = getSocket();

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const createPeerConnection = (socketId: string, stream: MediaStream) => {
    if (peers[socketId]) return peers[socketId];
    const pc = new RTCPeerConnection();

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      const audio = document.createElement("audio");
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      document.body.appendChild(audio);
      remoteAudioElements[socketId] = audio;
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: socketId, candidate: event.candidate });
      }
    };

    peers[socketId] = pc;
    return pc;
  };

  const joinRoomHandler = async () => {
    if (!roomId) {
      toast.error('Room ID is missing.');
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

      // Start audio stream after successfully joining
      await startAudio(currentUser?.id || "", roomId);

      // Emit join-room event with audio enabled
      socket?.emit('join-room', {
        roomId,
        user: {
          id: currentUser?.id,
          name: currentUser?.fullName
        },
      });

      onClose();
    } catch (error) {
      console.error('Join room failed:', error);
      hasJoinedRoom.current = false;
    }
  };

  useEffect(() => {
    if (!socket || !roomId || !hasJoinedRoom.current) return;

    socket.on("user-joined", async ({ user, socketId }) => {
      handleUserJoined({ user });
      if (socketId === socket.id) return;

      // Only create peer connection if we have audio enabled
      if (localStreamRef.current) {
        const pc = createPeerConnection(socketId, localStreamRef.current);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: socketId, offer });
      }
    });

    socket.on("user-left", ({ memberId, socketId }) => {
      handleUserLeft({ memberId });

      if (peers[socketId]) {
        peers[socketId].close();
        delete peers[socketId];
      }

      if (remoteAudioElements[socketId]) {
        const stream = remoteAudioElements[socketId].srcObject as MediaStream | null;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        document.body.removeChild(remoteAudioElements[socketId]);
        delete remoteAudioElements[socketId];
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, roomId, hasJoinedRoom.current]);

  useEffect(() => {
    if (!socket || !roomId || !hasJoinedRoom.current) return;

    socket.on("offer", async ({ from, offer }) => {
      let pc = peers[from];
      if (!pc && localStreamRef.current) {
        pc = createPeerConnection(from, localStreamRef.current);
      }

      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      }
    });

    socket.on("answer", async ({ from, answer }) => {
      const pc = peers[from];
      if (pc && pc.signalingState === "have-local-offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = peers[from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [socket, roomId, hasJoinedRoom.current]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio(currentUser?.id || "");
      Object.keys(peers).forEach(socketId => {
        peers[socketId].close();
        delete peers[socketId];
      });
      Object.keys(remoteAudioElements).forEach(socketId => {
        const stream = remoteAudioElements[socketId].srcObject as MediaStream | null;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        if (remoteAudioElements[socketId].parentNode) {
          document.body.removeChild(remoteAudioElements[socketId]);
        }
        delete remoteAudioElements[socketId];
      });
    };
  }, []);

  const handleBackToHome = () => {
    stopAudio(currentUser?.id || "");
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
                  className="bg-green-500/90 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isLoading}
                  onClick={joinRoomHandler}
                >
                  <DoorOpen size={20} />Join Room
                </button>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Participants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
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