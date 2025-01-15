import React from 'react'
import { Timer, X } from 'lucide-react';

type HeaderProps = {
  title: string;
  description: string;
  timeLeft: number;
  onClose: () => void;
}

export default function Header({title, description, timeLeft, onClose}: HeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-b border-gray-800 p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#343434] px-3 py-1.5 rounded-full">
          <Timer className="w-4 h-4 text-green-500" />
          <span className="text-white font-medium">{formatTime(timeLeft)}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
