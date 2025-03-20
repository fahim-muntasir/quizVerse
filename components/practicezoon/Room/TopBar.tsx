import React from 'react'
import { MoreVertical } from "lucide-react";
import { RoomType } from "@/types/room";

export default function TopBar({ room }: { room: RoomType }) {
  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="h-16 bg-background backdrop-blur-sm flex items-center justify-between px-6 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <span className="text-white font-medium">{room.title}</span>
        <span className="text-sm px-2 py-1 bg-gray-800/50 rounded-full text-gray-300">
          {room.language}
        </span>
        <span className={`text-sm px-2 py-1 rounded-full border ${levelColors[room.level]}`}>
          {room.level}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <MoreVertical size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}
