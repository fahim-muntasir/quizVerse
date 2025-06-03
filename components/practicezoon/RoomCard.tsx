import React, { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Globe2, Expand } from 'lucide-react';
import { RoomType } from '@/types/room';
import { generateIdenticonAvatar } from '@/utils/generateAvatar';

type RoomCardProps = {
  room: RoomType;
}

export const RoomCard = forwardRef<HTMLDivElement, RoomCardProps>(({ room }, ref) => {
  const router = useRouter();

  const levelColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Advanced: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Native: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const isUnlimited = room.maxParticipants === 0 || room.maxParticipants === Infinity;
  const maxGridCols = isUnlimited ? 5 : room.maxParticipants > 5 ? 5 : room.maxParticipants;

  const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };

  const gridColsClass: string = gridColsMap[maxGridCols] ?? "grid-cols-1";

  const getSizeClasses = () => {
    if (room.maxParticipants < 5) {
      if (room.maxParticipants === 4) return "w-[75px] h-[75px]";
      if (room.maxParticipants === 3) return "w-[98px] h-[98px]";
      if (room.maxParticipants <= 2) return "w-[105px] h-[105px]";
    }
    return "w-14 h-14";
  };

  const handleRoomClick = (roomId: string) => {
    router.push(`/room/${roomId}`);
  }

  return (
    <div
      ref={ref}
      className="bg-background border border-gray-800 rounded-lg p-6 transition-all h-80 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
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
          <h3 className="text-sm text-gray-400">{room.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Users size={18} />
          <span>{room.members.length}/{isUnlimited ? "∞" : room.maxParticipants}</span>
        </div>
      </div>

      {/* Members Section */}
      <div
        className={`grid w-max ${gridColsClass} gap-3 ${room.maxParticipants < 3 ? "justify-start" : "justify-between"
          } mx-auto`}
      >
        {isUnlimited ? (
          room.members.map((member) => (
            <div key={member.id} className="relative group">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-800 shadow-md group-hover:scale-110 transition-transform"
              />
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 px-2 py-1 bg-black text-xs text-white rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                {member.name}
              </div>
            </div>
          ))
        ) : (
          Array.from({ length: room.maxParticipants }).map((_, index) => {
            const member = room.members[index];
            const avatarSvg = member?.avatar || (member ? generateIdenticonAvatar(member.name, 150) : null);

            return (
              <div key={index} className="relative group">
                {member ? (
                  <>
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className={`${getSizeClasses()} rounded-full object-cover border-2 border-gray-800 shadow-md group-hover:scale-110 transition-transform`}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{ __html: avatarSvg! }}
                        className={`${getSizeClasses()} rounded-full border-2 border-dashed border-gray-800 shadow-md flex items-center justify-center group-hover:scale-110 overflow-hidden transition-transform`}
                      />
                    )}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-1 px-2 py-1 bg-black text-xs text-white rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                      {member.name}
                    </div>
                  </>
                ) : (
                  <div
                    className={`${getSizeClasses()} rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center text-gray-400 text-xs`}
                  ></div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={() => handleRoomClick(room.id)}
        className="w-full text-gray-200 border border-dashed border-green-500/90 hover:bg-green-500 text-sm py-1 rounded-lg cursor-pointer flex items-center justify-center gap-2"
      >
        <Expand size={18} /> View Details
      </button>
    </div>
  );
});

RoomCard.displayName = "RoomCard";
