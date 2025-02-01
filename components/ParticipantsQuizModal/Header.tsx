import React from 'react'
import { Timer, X } from 'lucide-react';

type HeaderProps = {
  title: string;
  description: string;
  timeLeft: number;
  onClose: () => void;
  isQuizSubmitted?: boolean;
}

export default function Header({ title, description, timeLeft, onClose, isQuizSubmitted }: HeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getOneThird = (seconds: number) => {
    return Math.floor(seconds / 3);
  };

  return (
    <div className="border-b border-gray-800 p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        {!isQuizSubmitted &&
          <div className="flex items-center justify-between w-[82px] bg-[#343434] px-3 py-1.5 rounded-full">

            {timeLeft < getOneThird(timeLeft) ? (
              <>
                <Timer className="w-4 h-4 text-danger" />
                <span className="text-danger font-medium">{formatTime(timeLeft)}</span>
              </>
            ) : (
              <>
                <Timer className="w-4 h-4 text-green-500" />
                <span className="text-white font-medium">{formatTime(timeLeft)}</span>
              </>
            )}
          </div>
        }
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
