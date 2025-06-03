import React from 'react'
import { RoomMember } from '@/types/room';
import Image from 'next/image';
import { Pin, Volume2, Crown } from 'lucide-react';
import { generateIdenticonAvatar } from '@/utils/generateAvatar';

export default function RoomParticipant({ member, isLarge = false, hostId }: { member: RoomMember; isLarge?: boolean; hostId: string }) {
  const avatarSvg = member.avatar || generateIdenticonAvatar(member.name, 150);

  return (
    <div className={`relative bg-gray-800/50 border border-gray-800 rounded-lg overflow-hidden group ${isLarge ? 'aspect-[16/9]' : 'aspect-video'}`}>
      {/* Centered Image */}
      {member.avatar ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={member.avatar}
            alt={member.name}
            width={150}
            height={150}
            className="w-32 h-32 md:w-32 md:h-32 lg:w-36 lg:h-36 object-fill rounded-full"
          />
        </div>
      ) : (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
            className="w-36 h-36 rounded-full flex items-center justify-center"
          />
        </div>
      )}

      {/* Video overlay controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-2 right-2 flex gap-1">
          <button className="p-1.5 rounded-lg bg-gray-900/80 text-white hover:bg-gray-800 transition-colors">
            <Pin size={16} />
          </button>
          <button className="p-1.5 rounded-lg bg-gray-900/80 text-white hover:bg-gray-800 transition-colors">
            <Volume2 size={16} />
          </button>
        </div>
      </div>

      {/* Participant info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">{member.name}</span>
            {member.id === hostId && (
              <span className="text-xs px-2 py-0.5 bg-blue-500 rounded-full text-white">Host</span>
            )}
          </div>
          {member.id === hostId && <Crown size={16} className="text-yellow-500" />}
        </div>
      </div>
    </div>
  )
}
