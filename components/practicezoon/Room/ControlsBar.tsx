import React, { useState, useEffect } from 'react'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Share2,
  Hand
} from 'lucide-react';
import ControlButton from './ControlButton';
// import { useAudioStream } from '@/hooks/useAudioStream';
import { useAudio } from '@/context/AudioContext';

export default function ControlsBar() {
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const { toggleMute, isMuted } = useAudio();

  const handleLeaveRoom = async () => {
    window.location.reload();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 w-full bg-background backdrop-blur-sm border-t border-gray-800">
      {/* Time (bottom-left) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        {currentTime}
      </div>

      {/* Controls (bottom-center) */}
      <div className="absolute bottom-4 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
        <ControlButton
          icon={isMuted ? MicOff : Mic}
          active={!isMuted}
          onClick={toggleMute}
          label='Mute/Unmute'
        />
        <ControlButton
          icon={isVideoOff ? VideoOff : Video}
          active={!isVideoOff}
          onClick={() => setIsVideoOff(!isVideoOff)}
          label='Video On/Off'
        />
        <ControlButton
          icon={Hand}
          active={isHandRaised}
          onClick={() => setIsHandRaised(!isHandRaised)}
          label='Raise Hand'
        />
        <ControlButton
          icon={Share2}
          label='Share Screen'
        />
        <ControlButton
          icon={PhoneOff}
          onClick={handleLeaveRoom}
          danger
          label='Leave Room'
        />
      </div>
    </div>
  )
}
