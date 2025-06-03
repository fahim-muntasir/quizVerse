import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Modal from '../../common/Modal';
import { Users, Globe2, Crown, DoorOpen, ArrowLeft } from 'lucide-react';
import { RoomType } from '@/types/room';
import { useAddRoomMemberMutation } from '@/libs/features/room/roomApiSlice';
import { useSocket } from '@/hooks/useSocket';
import { useAppSelector } from '@/libs/hooks';

// Mock data - replace with real data fetching
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

export default function RoomDetailsModal({ isOpen, onClose, handleUserJoined, handleUserLeft }: { isOpen: boolean, onClose: () => void, handleUserJoined: (data: { user: { id: string, name: string } }) => void, handleUserLeft: (data: { memberId: string }) => void }) {
  const [addRoomMember, { isLoading }] = useAddRoomMemberMutation();
  const currentUser = useAppSelector(state => state.auth.user);
  const room = mockRoom;
  const router = useRouter();
  const { id } = useParams();
  const roomId = Array.isArray(id) ? id[0] : id;

  const socket = useSocket();

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
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
    }
  };

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      console.log("user leaving...");
    };
  }, [socket, roomId]);

  const handleBackToHome = () => {
    router.push(`/practicezoon`);
  }

  if (isOpen) {
    return null;
  }

  return (
    <Modal>
      <div className=" p-6">
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
              <button
                className="bg-green-500/90 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-1"
                disabled={isLoading}
                onClick={joinRoomHandler}
              >
                <DoorOpen />Join Room
              </button>
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
                      {/* <span className={`text-sm ${levelColors[member.proficiency]} px-2 py-0.5 rounded-full`}>
                        {member.proficiency}
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-8">
              <button
                onClick={handleBackToHome}
                className="bg-red-500/90 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-1"
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
