import React, { useEffect } from 'react'
import { useSocket } from '@/context/SocketContext';
import { RoomType } from '@/types/room';
import TopBar from './TopBar';
import RoomGrid from './RoomGrid';
import ControlsBar from './ControlsBar';
import SidePanel from './SidePanel';
import { useAppDispatch } from '@/libs/hooks';
import { setUnMutedUser, removeUnMutedUser } from '@/libs/features/room/roomSlice';

export default function RoomLayout({ room, layout, isJoined, sidebarCollapsed, setSidebarCollapsed }: {
  room: RoomType | null,
  layout: 'grid' | 'spotlight',
  isJoined: boolean,
  sidebarCollapsed: boolean,
  setSidebarCollapsed: (collapsed: boolean) => void,
}) {
  const { on } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubMuted = on("user-mute-status", (payload: unknown) => {
      const data = payload as { roomId: string; userId: string; isUnMuted: boolean };
      console.log("Received user-mute-status:", data);

      if(data.isUnMuted) {
        dispatch(setUnMutedUser(data.userId));
      } else {
        dispatch(removeUnMutedUser(data.userId));
      }
    });

    return () => unsubMuted();
  }, [on, dispatch]);

  return (
    <>
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
    </>
  )
}
