import React from 'react'
import { RoomType } from '@/types/room';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Chat from './Chat';
import ParticipantsList from './ParticipantsList';

export default function SidePanel({ showChat,
  showParticipants,
  sidebarCollapsed,
  setSidebarCollapsed,
  room }: { showChat: boolean; showParticipants: boolean; sidebarCollapsed: boolean; setSidebarCollapsed: (value: boolean) => void; room: RoomType }) {

  return (
    <div className={`bg-background z-10 border-l border-gray-800 transition-all ${sidebarCollapsed ? 'w-0' : 'w-80'
      }`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {showChat ? 'Chat' : 'Participants'}
          </h2>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-[#343434] rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronLeft size={20} className="text-gray-400" />
            ) : (
              <ChevronRight size={20} className="text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {showParticipants && <ParticipantsList room={room} />}

          {showChat && <Chat />}
        </div>
      </div>
    </div>
  )
}
