import React from 'react'
import RoomParticipant from './RoomParticipant'
import { RoomType } from '@/types/room';
import { useAppSelector } from '@/libs/hooks';
import CreateQuizModal from '@/components/CreateQuizModal';
import ParticipantsQuizModal from '@/components/ParticipantsQuizModal';

export default function RoomGrid({ room, layout }: { room: RoomType; layout: string }) {
  const {isOpen: createQuizModalIsOpen} = useAppSelector(state => state.modal.createQuizModal);

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className={`grid gap-4 ${layout === 'grid'
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'grid-cols-1 lg:grid-cols-[2fr_1fr]'
        }`}>
        {layout === 'spotlight' ? (
          <>
            <RoomParticipant member={room.members[0]} isLarge />
            <div className="grid gap-4 grid-cols-1">
              {room.members.slice(1).map((member) => (
                <RoomParticipant key={member.id} member={member} />
              ))}
            </div>
          </>
        ) : (
          room.members.map((member) => (
            <RoomParticipant key={member.id} member={member} />
          ))
        )}

        {/* all modals inside the room */}
        <CreateQuizModal isOpen={createQuizModalIsOpen} />
        <ParticipantsQuizModal />
      </div>
    </div>
  )
}
