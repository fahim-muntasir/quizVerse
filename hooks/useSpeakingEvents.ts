import { useEffect } from "react";
import { getSocket } from "@/libs/socket";
import { useAppDispatch } from "@/libs/hooks";
import { setSpeakingUser, removeSpeakingUser } from "@/libs/features/room/roomSlice";

export function useSpeakingEvents(roomId: string) {
  const socket = getSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleSpeaking = ({ userId, speaking }: { userId: string; speaking: boolean }) => {
      console.log(`User ${userId} is ${speaking ? "speaking" : "not speaking"}`);
      if (speaking) dispatch(setSpeakingUser(userId));
      else dispatch(removeSpeakingUser(userId));
    };

    socket.on("user-speaking", handleSpeaking);

    return () => {
      socket.off("user-speaking", handleSpeaking);
    };
  }, [socket, roomId, dispatch]);
}
