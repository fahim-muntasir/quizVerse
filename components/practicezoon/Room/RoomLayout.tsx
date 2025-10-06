import React, {useEffect} from 'react'
import { RoomType } from '@/types/room';
import TopBar from './TopBar';
import RoomGrid from './RoomGrid';
import ControlsBar from './ControlsBar';
import SidePanel from './SidePanel';

export default function RoomLayout({ room, layout, isJoined, sidebarCollapsed, setSidebarCollapsed }: {
  room: RoomType | null,
  layout: 'grid' | 'spotlight',
  isJoined: boolean,
  sidebarCollapsed: boolean,
  setSidebarCollapsed: (collapsed: boolean) => void
}) {
  useEffect(() => {
    console.log("RoomLayout rendered");
  }, []);

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
