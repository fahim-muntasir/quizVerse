"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetSingleRoomQuery } from '@/libs/features/room/roomApiSlice';
import { RoomType } from '@/types/room';
import TopBar from '@/components/practicezoon/Room/TopBar';
import RoomGrid from '@/components/practicezoon/Room/RoomGrid';
import ControlsBar from '@/components/practicezoon/Room/ControlsBar';
import SidePanel from '@/components/practicezoon/Room/SidePanel';
import { BackgroundPattern } from '@/components/background/BackgroundPattern';
import RoomDetailsModal from '@/components/practicezoon/Room/RoomDetailsModal';
// import { useSocket } from '@/hooks/useSocket';
import { getSocket } from '@/libs/socket';
import { useAppSelector } from '@/libs/hooks';
import { isRoomResponse } from '@/utils/typeGuardsForRoom';

const VideoConference = () => {
  const [room, setRoom] = useState<RoomType | null>(null);
  const [layout, setLayout] = useState<'grid' | 'spotlight'>('grid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const { id } = useParams();
  const roomId = Array.isArray(id) ? id[0] : id ?? '';
  const { data: singleRoomData, isSuccess, refetch } = useGetSingleRoomQuery(roomId, {
    refetchOnMountOrArgChange: true,
  });

  const currentUser = useAppSelector((state) => state.auth.user);
  const socket = getSocket();
  console.log("single room data:", room);
  console.log(isRoomResponse(singleRoomData));
  useEffect(() => {
    if (singleRoomData && isSuccess && isRoomResponse(singleRoomData)) {
      setRoom(singleRoomData.data);
    }
  }, [singleRoomData, isSuccess]);

  // ✅ Handle user leaving tab/window
  useEffect(() => {
    const handleBeforeUnload = () => {
      // ❗ Synchronous cleanup only
      if (socket && currentUser?.id) {
        socket.emit('leave-room', { roomId, memberId: currentUser.id });
      }
    };

    if (room?.members.find((member) => member.id === currentUser?.id)) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [room, currentUser, socket, roomId]);

  const handleUserJoined = ({ user }: { user: { id: string, name: string } }) => {
    console.log('user joined', user);
    setRoom((prevRoom) => {
      if (!prevRoom) return prevRoom;
      const alreadyExists = prevRoom.members.some((member) => member.id === user.id);
      if (alreadyExists) return prevRoom;
      return {
        ...prevRoom,
        members: [...prevRoom.members, user],
      };
    });

    refetch();
  };

  const handleUserLeft = async ({ memberId }: { memberId: string }) => {
    console.log("user left", memberId);
    setRoom((prevRoom) => {
      if (!prevRoom) return prevRoom;
      return {
        ...prevRoom,
        members: prevRoom.members.filter((member) => member.id !== memberId),
      };
    });
  };

  useEffect(() => {

    const handleMsg = (data) => {
      console.log("📩 Got message on client:", data);
    };

    if (socket) {
      socket.on("messageReceived", handleMsg);
    }

    return () => {
      if (socket) {
        socket.off("messageReceived", handleMsg);
      }
    };
  }, [socket]);


  return (
    <div className="flex min-h-screen relative bg-[#1C1C1C]">
      {/* Room details modal */}
      <RoomDetailsModal isOpen={isJoined} onClose={() => setIsJoined(true)} handleUserJoined={handleUserJoined} handleUserLeft={handleUserLeft} />

      <BackgroundPattern />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <TopBar room={room} />

        {/* Video grid */}
        <RoomGrid layout={layout} room={room} isJoined={isJoined} />

        {/* Controls */}
        <ControlsBar />
      </div>

      {/* Side panel */}
      <SidePanel
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
    </div>
  );
};

export default VideoConference;