"use client";
import React, { useState } from 'react';
import { RoomType } from '@/types/room';
import TopBar from '@/components/practicezoon/Room/TopBar';
import RoomGrid from '@/components/practicezoon/Room/RoomGrid';
import ControlsBar from '@/components/practicezoon/Room/ControlsBar';
import SidePanel from '@/components/practicezoon/Room/SidePanel';
import { BackgroundPattern } from '@/components/background/BackgroundPattern';

// Mock data - replace with real data fetching
const room: RoomType = {
  id: "1",
  title: "English Conversation Practice",
  description: "Let's practice everyday English conversation! All levels welcome.",
  language: "English",
  level: "Intermediate",
  maxParticipants: 6,
  currentParticipants: 4,
  status: "active",
  createdAt: new Date().toISOString(),
  members: [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      proficiency: "Native",
      isHost: true
    },
    {
      id: "2",
      name: "Miguel Rodriguez",
      // avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      proficiency: "Intermediate",
      isHost: false
    },
    {
      id: "3",
      name: "Yuki Tanaka",
      // avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      proficiency: "Advanced",
      isHost: false
    },
    {
      id: "4",
      name: "Hans Weber",
      // avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      proficiency: "Intermediate",
      isHost: false
    }
  ]
};

const VideoConference = () => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'spotlight'>('grid');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen relative bg-[#1C1C1C]">
      <BackgroundPattern />
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <TopBar room={room} />

        {/* Video grid */}
        <RoomGrid room={room} layout={layout} />

        {/* Controls */}
        <ControlsBar
          setShowChat={setShowChat}
          setShowParticipants={setShowParticipants}
          showChat={showChat}
          showParticipants={showParticipants}
          setLayout={setLayout}
        />
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