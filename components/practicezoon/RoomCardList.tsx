"use client";
import React, {useState} from 'react'
import { RoomCard } from './RoomCard'
import { RoomType } from '@/types/room'
import RoomDetailsModal from './RoomDetailsModal';

const mockRooms: RoomType[] = [
  {
    id: "1",
    title: "English Conversation Practice",
    description: "Let's practice everyday English conversation! All levels welcome.",
    language: "English",
    level: "Intermediate",
    maxParticipants: 2,
    currentParticipants: 2,
    status: "active",
    createdAt: new Date().toISOString(),
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        proficiency: "Native",
        isHost: true
      },
      {
        id: "2",
        name: "Miguel Rodriguez",
        // avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        proficiency: "Intermediate",
        isHost: false
      }
    ]
  },
  {
    id: "2",
    title: "English Conversation Practice",
    description: "Let's practice everyday English conversation! All levels welcome.",
    language: "English",
    level: "Beginner",
    maxParticipants: 4,
    currentParticipants: 4,
    status: "active",
    createdAt: new Date().toISOString(),
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        // avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        proficiency: "Native",
        isHost: true
      },
      {
        id: "2",
        name: "Miguel Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        proficiency: "Intermediate",
        isHost: false
      },
      {
        id: "3",
        name: "Yuki Tanaka",
        // avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        proficiency: "Advanced",
        isHost: false
      },
      {
        id: "4",
        name: "Hans Weber",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        proficiency: "Intermediate",
        isHost: false
      }
    ]
  },
  {
    id: "3",
    title: "English Conversation Practice",
    description: "Let's practice everyday English conversation! All levels welcome.",
    language: "English",
    level: "Advanced",
    maxParticipants: 10,
    currentParticipants: 7,
    status: "active",
    createdAt: new Date().toISOString(),
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        // avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        proficiency: "Native",
        isHost: true
      },
      {
        id: "2",
        name: "Miguel Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        proficiency: "Intermediate",
        isHost: false
      },
      {
        id: "3",
        name: "Yuki Tanaka",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        proficiency: "Advanced",
        isHost: false
      },
      {
        id: "4",
        name: "Hans Weber",
        // avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        proficiency: "Intermediate",
        isHost: false
      },
      {
        id: "5",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        proficiency: "Native",
        isHost: true
      },
      {
        id: "6",
        name: "Miguel Rodriguez",
        // avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        proficiency: "Intermediate",
        isHost: false
      },
      {
        id: "7",
        name: "Yuki Tanaka",
        // avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        proficiency: "Advanced",
        isHost: false
      }
    ]
  },
  {
    id: "4",
    title: "English Conversation Practice",
    description: "Let's practice everyday English conversation! All levels welcome.",
    language: "English",
    level: "Native",
    maxParticipants: 3,
    currentParticipants: 1,
    status: "active",
    createdAt: new Date().toISOString(),
    members: [
      {
        id: "1",
        name: "Sarah Johnson",
        // avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        proficiency: "Native",
        isHost: true
      }
    ]
  },
  // Add more mock rooms here
];

export default function RoomCardList() {
  const [isOpen, setIsOpen] = useState(false);

  const handleRoomClick = () => {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {mockRooms.map((room) => (
          <RoomCard key={room.id} room={room} handler={handleRoomClick} />
        ))}
      </div>
      <RoomDetailsModal isOpen={isOpen} handler={handleRoomClick} />
    </>
  )
}
