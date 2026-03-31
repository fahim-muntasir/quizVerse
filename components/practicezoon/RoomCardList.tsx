// components/practicezoon/RoomCardList.tsx
"use client";
import React, { useState, useEffect } from "react";
import { RoomCard } from "./RoomCard";
import { RoomType } from "@/types/room";
import { useGetRoomsQuery } from "@/libs/features/room/roomApiSlice";
import { useSocket } from "@/context/SocketContext";
import { isRoomsResponse } from "@/utils/typeGuardsForRoom";
import EmptyRoomCard from "../common/EmptyRoomCard";

export default function RoomCardList() {
  const { data: initialRooms } = useGetRoomsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const { on } = useSocket();

  useEffect(() => {
    if (initialRooms && isRoomsResponse(initialRooms)) {
      setRooms(initialRooms.data);
    }
  }, [initialRooms]);

  useEffect(() => {
    const unsubCreated = on("roomCreated", (payload: unknown) => {
      setRooms((prev) => [payload as RoomType, ...prev]);
    });

    const unsubJoined = on("joinedMember", (payload: unknown) => {
      const data = payload as { roomId: string; newMember: RoomType["members"][number] };
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== data.roomId) return room;
          const exists = room.members.some((m) => m.id === data.newMember.id);
          if (exists) return room;
          return { ...room, members: [...room.members, data.newMember] };
        })
      );
    });

    const unsubLeft = on("removedMember", (payload: unknown) => {
      const data = payload as { roomId: string; memberId: string };
      setRooms((prev) =>
        prev.map((room) => {
          if (room.id !== data.roomId) return room;
          return {
            ...room,
            members: room.members.filter((m) => m.id !== data.memberId),
          };
        })
      );
    });

    return () => {
      unsubCreated();
      unsubJoined();
      unsubLeft();
    };
  }, [on]);

  if (!rooms || rooms.length === 0) return <EmptyRoomCard />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}