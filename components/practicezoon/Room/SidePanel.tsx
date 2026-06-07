import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronRight,
  MessageSquareText,
  Users,
  HelpCircle,
  Settings
} from 'lucide-react';
import { socketManager } from "@/libs/socket/index";
import { useAppSelector } from "@/libs/hooks";
import Chat from './Chat';
import RoomQuizzes from './RoomQuizzes/index';
// import ParticipantsList from './ParticipantsList';
import { IncomingMessage, Message } from '@/types/chat';

export default function SidePanel({
  sidebarCollapsed,
  setSidebarCollapsed
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (value: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<'Chat' | 'Participants' | 'Quizzes' | 'Setting'>('Chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = useAppSelector((state) => state.auth.user);

  const activeTabRef = useRef(activeTab);
  const sidebarCollapsedRef = useRef(sidebarCollapsed);

  useEffect(() => {
    sidebarCollapsedRef.current = sidebarCollapsed;
  }, [sidebarCollapsed]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const icons = [
    { label: 'Chat', icon: <MessageSquareText size={22} />, active: false },
    { label: 'Participants', icon: <Users size={22} />, active: false },
    { label: 'Settings', icon: <Settings size={22} />, active: false },
    { label: 'Quizzes', icon: <HelpCircle size={22} />, active: false },
  ];

  useEffect(() => {
    const unsub = socketManager.on("messageReceived", (payload: unknown) => {
      const data = payload as IncomingMessage;

      const isOwn = data.senderId === currentUser?.id;

      if (isOwn) return;

      const newMsg: Message = {
        id: `${data.senderId}-${data.timestamp}`,
        sender: isOwn ? "user" : "other",
        name: isOwn ? "You" : data.message.senderName,
        text: data.message.text,
        emojiOnly: data.message.emojiOnly,
        imageUrl: data.message.imageUrl,
        gifUrl: data.message.gifUrl,
        replyTo: data.message.replyTo ?? undefined,
        reactions: [],
      };

      if (activeTabRef.current !== 'Chat' || !sidebarCollapsedRef.current) {
        setUnreadCount((prev) => prev + 1);
      }

      setMessages((prev) => [...prev, newMsg]);
    });

    return () => unsub();
  }, [currentUser?.id]);

  const sideMenuHandler = (label: string) => {
    setActiveTab(label as 'Chat' | 'Participants' | 'Quizzes' | 'Setting');

    if (label === 'Chat') {
      setUnreadCount(0);
    }

    setSidebarCollapsed(true);
  }

  return (
    <div
      className={`bg-background z-10 border-l border-gray-800 ${!sidebarCollapsed ? 'w-16' : 'w-[23rem]'
        }`}
    >
      {/* Collapsed sidebar */}
      {!sidebarCollapsed && (
        <div className="flex gap-4 items-center transition-all flex-col justify-end h-full pb-8">
          {icons.map((item, index) => (
            <button
              key={index}
              onClick={() => sideMenuHandler(item.label)}
              className={`relative flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-700/40 text-sm text-white transform transition-all duration-500 ease-in-out`}
            >
              {item.icon}

              {item.label === 'Chat' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow-lg shadow-red-500/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Expanded sidebar */}
      {sidebarCollapsed && (
        <div className="flex gap-4 items-center transition-all flex-row h-16 border-b border-gray-800 px-4">
          {icons.map((item, index) => (
            <button
              key={index}
              onClick={() => sideMenuHandler(item.label)}
              className={`relative flex items-center gap-2 px-2 py-2 rounded-md text-sm text-white transform transition-all duration-500 ease-in-out ${activeTab === item.label
                ? 'bg-primary/70'
                : 'hover:bg-gray-700/40'
                }`}
            >
              {item.icon}

              {item.label === 'Chat' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white shadow-lg shadow-red-500/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto px-2 py-2 rounded-md hover:bg-gray-700/40 text-sm text-white transition-opacity duration-500"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}

      {sidebarCollapsed && activeTab === 'Chat' && (
        <Chat messages={messages} setMessages={setMessages} />
      )}

      {sidebarCollapsed && activeTab === 'Quizzes' && (
        <RoomQuizzes />
      )}
    </div>
  );
}
