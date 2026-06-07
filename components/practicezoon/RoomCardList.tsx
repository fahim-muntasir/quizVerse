// components/practicezoon/RoomCardList.tsx
"use client";
import React, { useState, useEffect } from "react";
import { RoomCard } from "./RoomCard";
import { RoomType } from "@/types/room";
import { useGetRoomsQuery } from "@/libs/features/room/roomApiSlice";
import { socketManager } from "@/libs/socket/index";
import { isRoomsResponse } from "@/utils/typeGuardsForRoom";
import EmptyRoomCard from "../common/EmptyRoomCard";

export default function RoomCardList() {
  const { data: initialRooms } = useGetRoomsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [rooms, setRooms] = useState<RoomType[]>([]);

  useEffect(() => {
    if (initialRooms && isRoomsResponse(initialRooms)) {
      setRooms(initialRooms.data);
    }
  }, [initialRooms]);

  useEffect(() => {
    const unsubCreated = socketManager.on("roomCreated", (payload) => {
      const room = payload as RoomType;

      setRooms((prev) => {
        if (prev.some((r) => r.id === room.id)) {
          return prev;
        }

        return [room, ...prev];
      });
    });

    const unsubJoined = socketManager.on("joinedMember", (payload: unknown) => {
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

    const unsubLeft = socketManager.on("removedMember", (payload: unknown) => {
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
  }, []);

  if (!rooms || rooms.length === 0) return <EmptyRoomCard />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}