'use client';
import React, { useState, useEffect } from 'react'
import { RoomCard } from './RoomCard'
import { RoomType } from '@/types/room'
import { useGetRoomsQuery } from '@/libs/features/room/roomApiSlice';
import { useSocket } from '@/hooks/useSocket';
import { isRoomsResponse } from '@/utils/typeGuardsForRoom';

export default function RoomCardList() {
  const { data: initialrooms } = useGetRoomsQuery();
  console.log("data", initialrooms)

  const [rooms, setRooms] = useState<RoomType[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (initialrooms && isRoomsResponse(initialrooms)) {
      setRooms(initialrooms?.data);
    }
  }, [initialrooms]);

  useEffect(() => {
    if (socket) {
      socket.on("roomCreated", (newRoom) => {
        console.log("new room:", newRoom);
        setRooms((prev) => [newRoom, ...prev]);

      });

      socket.on("joinedMember", (data) => {
        console.log("newMember:", data);

        setRooms((prevRooms) => {
          if (!prevRooms || !Array.isArray(prevRooms)) return prevRooms;

          return prevRooms.map((room) => {
            if (room.id !== data.roomId) return room;

            // Check if member already exists
            const memberExists = room.members.some((m) => m.id === data.newMember.id);
            if (memberExists) return room;

            return {
              ...room,
              members: [...room.members, data.newMember],
            };
          });
        });
      });

      socket.on("removedMember", (data) => {
        console.log("removedMember:", data);

        setRooms((prevRooms) => {
          if (!prevRooms || !Array.isArray(prevRooms)) return prevRooms;

          return prevRooms.map((room) => {
            if (room.id !== data.roomId) return room;

            return {
              ...room,
              members: room.members.filter((m) => m.id !== data.memberId),
            };
          });
        });
      });

    }
  }, [socket])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  )
}
