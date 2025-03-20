export type Language = 'English' | 'Spanish' | 'French' | 'German' | 'Japanese' | 'Korean' | 'Chinese';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';

export interface RoomMember {
  id: string;
  name: string;
  avatar?: string;
  proficiency: ProficiencyLevel;
  isHost: boolean;
}

export interface RoomType {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: ProficiencyLevel;
  maxParticipants: number;
  currentParticipants: number;
  members: RoomMember[];
  status: 'active' | 'full' | 'ended';
  createdAt: string;
}