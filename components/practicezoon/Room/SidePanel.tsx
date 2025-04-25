import React, { useState } from 'react'
import {
  ChevronRight,
  MessageSquareText,
  Users,
  HelpCircle,
  Settings 
} from 'lucide-react';
import Chat from './Chat';
import RoomQuizzes from './RoomQuizzes/index';
// import ParticipantsList from './ParticipantsList';

export default function SidePanel({
  sidebarCollapsed,
  setSidebarCollapsed
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Participants' | 'Quizzes' | 'Setting'>('Chat');

  const icons = [
    { label: 'Chat', icon: <MessageSquareText size={22} />, active: false },
    { label: 'Participants', icon: <Users size={22} />, active: false },
    { label: 'Settings', icon: <Settings size={22} />, active: false },
    { label: 'Quizzes', icon: <HelpCircle size={22} />, active: false },
  ];

  const sideMenuHandler = (label: string) => {
    setActiveTab(label as 'Chat' | 'Participants' | 'Quizzes' | 'Setting');
    setSidebarCollapsed(true);
  }

  return (
    <div className={`bg-background z-10 border-l border-gray-800  ${!sidebarCollapsed ? 'w-16' : 'w-[23rem]'}`}>

      {!sidebarCollapsed && <div className={` flex gap-4 items-center transition-all flex-col justify-end h-full pb-8`}>
        {icons.map((item, index) => (
          <button
            key={index}
            onClick={() => sideMenuHandler(item.label)}
            className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-700/40 text-sm text-white transform transition-all duration-500 ease-in-out translate-y-0 delay-${(index + 1) * 100}
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>}

      {sidebarCollapsed && <div className={` flex gap-4 items-center transition-all flex-row h-16 border-b border-gray-800 px-4`}>
        {icons.map((item, index) => (
          <button
            key={index}
            onClick={() => sideMenuHandler(item.label)}
            className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm text-white transform transition-all duration-500 ease-in-out translate-y-0 delay-75 ${activeTab === item.label ? 'bg-primary/70' : 'hover:bg-gray-700/40'}`}
          >
            {item.icon}
          </button>
        ))}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`ml-auto px-2 py-2 rounded-md hover:bg-gray-700/40 text-sm text-white transform transition-opacity duration-500 delay-700`}
        >
          <ChevronRight size={22} />
        </button>
      </div>}

      {sidebarCollapsed && activeTab === 'Chat' && <Chat />}

      {sidebarCollapsed && activeTab === 'Quizzes' && <RoomQuizzes />}
    </div>
  )
}
