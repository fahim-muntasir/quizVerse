"use client";
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
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
  toggleMute: (roomId: string, userId: string) => void;
};

const Audiocontext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dispatch = useAppDispatch();
  const isMuted = useAppSelector((s) => s.room.isMuted);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const wasSpeakingRef = useRef(false);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRoomIdRef = useRef<string>("");
  const currentUserIdRef = useRef<string>("");

  const socket = getSocket();

  // Initialize audio detection (called after stream is obtained)
  const initializeAudioDetection = (stream: MediaStream, userId: string, roomId: string) => {
    try {
      if (!audioContextRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const detectSpeaking = () => {
        // Only detect speaking if not muted
        const currentTrack = localStreamRef.current?.getAudioTracks()[0];
        const isTrackEnabled = currentTrack?.enabled ?? false;

        if (isTrackEnabled) {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          const isNowSpeaking = volume > 25; // Threshold for speaking detection

          if (isNowSpeaking && !wasSpeakingRef.current) {
            // User just started speaking
            wasSpeakingRef.current = true;
            dispatch(setSpeakingUser(userId));
            socket?.emit("user-speaking", { roomId, userId, speaking: true });
          } else if (!isNowSpeaking && wasSpeakingRef.current) {
            // User might have stopped speaking — wait a bit to confirm
            if (stopTimeoutRef.current) {
              clearTimeout(stopTimeoutRef.current);
            }
            stopTimeoutRef.current = setTimeout(() => {
              wasSpeakingRef.current = false;
              dispatch(removeSpeakingUser(userId));
              socket?.emit("user-speaking", { roomId, userId, speaking: false });
            }, 500); // 500ms delay before marking as stopped
          }
        } else {
          // If muted, ensure user is not marked as speaking
          if (wasSpeakingRef.current) {
            wasSpeakingRef.current = false;
            dispatch(removeSpeakingUser(userId));
            socket?.emit("user-speaking", { roomId, userId, speaking: false });
          }
        }

        animationFrameRef.current = requestAnimationFrame(detectSpeaking);
      };

      detectSpeaking();
    } catch (err) {
      console.error("Failed to initialize audio detection:", err);
    }
  };

  const startAudio = async (userId: string, roomId: string): Promise<MediaStream | null> => {
    try {
      // Store current room and user for later use
      currentRoomIdRef.current = roomId;
      currentUserIdRef.current = userId;

      // Start with muted state - no device needed yet
      setIsAudioEnabled(true);
      dispatch(setAudioEnabled(true));
      dispatch(setMuted(true)); // Set Redux state to muted
      
      toast.success("Joined room (microphone muted by default)");

      // Don't request microphone access yet - user is muted
      // Will request when they try to unmute
      return null;
    } catch (err) {
      console.error("Error starting audio:", err);
      toast.error("Failed to initialize audio");
      throw err;
    }
  };

  const requestMicrophoneAccess = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Get the audio track and enable it (unmuted)
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = true; // Enable track
      }
      
      localStreamRef.current = stream;
      
      // Initialize speaking detection
      initializeAudioDetection(stream, currentUserIdRef.current, currentRoomIdRef.current);
      
      return stream;
    } catch (err) {
      console.error("Microphone access error:", err);
      
      // Handle specific error cases
      if (err instanceof DOMException) {
        if (err.name === 'NotFoundError') {
          toast.error("No microphone found. Please connect a microphone.");
        } else if (err.name === 'NotAllowedError') {
          toast.error("Microphone access denied. Please allow microphone access.");
        } else if (err.name === 'NotReadableError') {
          toast.error("Microphone is already in use by another application.");
        } else {
          toast.error("Failed to access microphone.");
        }
      } else {
        toast.error("Failed to access microphone.");
      }
      
      throw err;
    }
  };

  const stopAudio = (userId: string) => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    
    setIsAudioEnabled(false);
    dispatch(setAudioEnabled(false));
    dispatch(removeSpeakingUser(userId));

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clear timeout
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    wasSpeakingRef.current = false;
    currentRoomIdRef.current = "";
    currentUserIdRef.current = "";
  };

  const toggleMute = async (roomId: string, userId: string) => {
    console.log("Toggling mute");
    
    // If currently muted, try to unmute
    if (isMuted) {
      // If no stream exists yet, request microphone access
      if (!localStreamRef.current) {
        try {
          const stream = await requestMicrophoneAccess();
          if (!stream) {
            // Failed to get microphone, stay muted
            return;
          }
          
          // Successfully got microphone, update state
          dispatch(setMuted(false));
          
          // Emit unmute status to other users
          socket?.emit('user-mute-status', {
            roomId,
            userId,
            isMuted: false
          });
          
          toast.success("Microphone unmuted");
        } catch (err) {
          // Error getting microphone, stay muted
          console.error("Failed to unmute:", err);
          dispatch(setMuted(true));
        }
      } else {
        // Stream exists, just enable the track
        const track = localStreamRef.current.getAudioTracks()[0];
        if (track) {
          track.enabled = true;
          dispatch(setMuted(false));
          
          socket?.emit('user-mute-status', {
            roomId,
            userId,
            isMuted: false
          });
          
          toast.success("Microphone unmuted");
        }
      }
    } else {
      // Currently unmuted, mute it
      if (localStreamRef.current) {
        const track = localStreamRef.current.getAudioTracks()[0];
        if (track) {
          track.enabled = false;
          dispatch(setMuted(true));
          
          // Emit mute status to other users
          socket?.emit('user-mute-status', {
            roomId,
            userId,
            isMuted: true
          });
          
          // Remove from speaking users
          dispatch(removeSpeakingUser(userId));
          socket?.emit("user-speaking", { roomId, userId, speaking: false });
          
          toast.success("Microphone muted");
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    const handleMuteStatus = ({ userId, isMuted }: { userId: string; isMuted: boolean }) => {
      console.log(`User ${userId} is now ${isMuted ? "muted" : "unmuted"}`);
      // You can add logic here to track other users' mute status if needed
    };

    socket?.on("user-mute-status", handleMuteStatus);

    return () => {
      socket?.off("user-mute-status", handleMuteStatus);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [socket]);

  return (
    <Audiocontext.Provider
      value={{ 
        localStreamRef, 
        isMuted, 
        isAudioEnabled, 
        startAudio, 
        stopAudio, 
        toggleMute 
      }}
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