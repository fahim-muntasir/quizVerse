import React, { forwardRef } from 'react';
import { Users, Globe2, Expand } from 'lucide-react';
import { RoomType } from '@/types/room';

interface RoomCardProps {
  room: RoomType;
  handler?: () => void;
}

export const RoomCard = forwardRef<HTMLDivElement, RoomCardProps>(({ room, handler }, ref) => {
  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div
      ref={ref}
      className="bg-background border border-gray-800 rounded-lg p-6 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-sm px-3 py-1 rounded-full border ${levelColors[room.level]}`}>
              {room.level}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              <Globe2 size={14} />
              {room.language}
            </span>
          </div>
          {/* <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{room.title}</h3> */}
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Users size={18} />
          <span>{room.currentParticipants}/{room.maxParticipants}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{room.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {room.members.slice(0, 4).map((member) => (
            <img
              key={member.id}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
              src={member.avatar}
              alt={member.name}
              title={member.name}
            />
          ))}
          {room.members.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              +{room.members.length - 4}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Created {new Date(room.createdAt).toLocaleDateString()}
        </span>
      </div>
      <button className='w-full mt-6 border border-dashed border-green-500/90 hover:bg-green-500 text-sm py-1 rounded-lg cursor-pointer flex items-center justify-center gap-2' onClick={handler}><Expand size={18} /> View Details</button>
    </div>
  );
});

RoomCard.displayName = "RoomCard";