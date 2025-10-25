// src/hooks/AudioContext.tsx
"use client";
import React, { createContext, useContext, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import {
  setAudioEnabled,
  setMuted,
  setSpeakingUser,
  removeSpeakingUser,
} from "@/libs/features/room/roomSlice";
import toast from "react-hot-toast";
import { getSocket } from "@/libs/socket";

type AudioContextType = {
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  isMuted: boolean;
  isAudioEnabled: boolean;
  startAudio: (userId: string, roomId: string) => Promise<MediaStream | null>;
  stopAudio: (userId: string) => void;
  toggleMute: () => void;
};

const Audiocontext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((s) => s.room.isMuted);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const wasSpeakingRef = useRef(false);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const socket = getSocket();

  const startAudio = async (userId: string, roomId: string): Promise<MediaStream | null> => {
    try {
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsAudioEnabled(true);
        dispatch(setAudioEnabled(true));
        toast.success("Microphone enabled");

        // 🔊 Detect speaking
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 512;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // const detectSpeaking = () => {
        //   analyser.getByteFrequencyData(dataArray);
        //   const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        //   if (volume > 20) {
        //     dispatch(setSpeakingUser(userId || ""));
        //     socket.emit("user-speaking", { roomId, userId, speaking: true });
        //   } else {
        //     dispatch(removeSpeakingUser(userId || ""));
        //     socket.emit("user-speaking", { roomId, userId, speaking: false });
        //   }

        //   requestAnimationFrame(detectSpeaking);
        // };

        const detectSpeaking = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          const isNowSpeaking = volume > 20;

          if (isNowSpeaking && !wasSpeakingRef.current) {
            // user just started speaking
            wasSpeakingRef.current = true;
            dispatch(setSpeakingUser(userId || ""));
            socket.emit("user-speaking", { roomId, userId, speaking: true });
          } else if (!isNowSpeaking && wasSpeakingRef.current) {
            // user might have stopped speaking — wait a bit to confirm
            if (stopTimeoutRef.current) {
              clearTimeout(stopTimeoutRef.current);
            }
            stopTimeoutRef.current = setTimeout(() => {
              wasSpeakingRef.current = false;
              dispatch(removeSpeakingUser(userId || ""));
              socket.emit("user-speaking", { roomId, userId, speaking: false });
            }, 500); // delay before marking as stopped
          }

          requestAnimationFrame(detectSpeaking);
        };


        detectSpeaking();
      }

      return localStreamRef.current;
    } catch (err) {
      console.error("Mic error:", err);
      toast.error("Failed to access microphone");
      throw err;
    }
  };

  const stopAudio = (userId: string) => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      setIsAudioEnabled(false);
      dispatch(setAudioEnabled(false));
      dispatch(removeSpeakingUser(userId || ""));
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        dispatch(setMuted(!track.enabled));
        toast.success(track.enabled ? "Unmuted" : "Muted");
      }
    }
  };

  // useEffect(() => {
  //   return () => stopAudio();
  // }, []);

  return (
    <Audiocontext.Provider
      value={{ localStreamRef, isMuted, isAudioEnabled, startAudio, stopAudio, toggleMute }}
    >
      {children}
    </Audiocontext.Provider>
  );
};

// Custom hook for easy access
export const useAudio = () => {
  const context = useContext(Audiocontext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
};
