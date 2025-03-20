import React, { useState } from 'react'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageCircle,
  Users, Share2, LayoutGrid,
  Hand
} from 'lucide-react';
import ControlButton from './ControlButton';

export default function ControlsBar({ setLayout, showChat, setShowChat, showParticipants, setShowParticipants }: {setLayout: (layout: 'grid' | 'spotlight') => void; showChat: boolean; setShowChat: (show: boolean) => void; showParticipants: boolean; setShowParticipants: (show: boolean) => void}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  return (
    <div className="h-24 bg-background backdrop-blur-sm border-t border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setLayout(l => l === 'grid' ? 'spotlight' : 'grid')}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-gray-300"
        >
          <LayoutGrid size={20} />
        </button>
        <span className="text-gray-400 text-sm">
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ControlButton
          icon={isMuted ? MicOff : Mic}
          active={!isMuted}
          onClick={() => setIsMuted(!isMuted)}
          label="Mic"
        />
        <ControlButton
          icon={isVideoOff ? VideoOff : Video}
          active={!isVideoOff}
          onClick={() => setIsVideoOff(!isVideoOff)}
          label="Camera"
        />
        <ControlButton
          icon={Hand}
          active={isHandRaised}
          onClick={() => setIsHandRaised(!isHandRaised)}
          label="Raise Hand"
        />
        <ControlButton
          icon={Share2}
          label="Share"
        />
        <ControlButton
          icon={PhoneOff}
          danger
          label="Leave"
        />
      </div>

      <div className="flex items-center gap-3">
        <ControlButton
          icon={MessageCircle}
          active={showChat}
          onClick={() => {
            setShowChat(!showChat);
            setShowParticipants(false);
          }}
          label="Chat"
        />
        <ControlButton
          icon={Users}
          active={showParticipants}
          onClick={() => {
            setShowParticipants(!showParticipants);
            setShowChat(false);
          }}
          label="People"
        />
      </div>
    </div>
  )
}
