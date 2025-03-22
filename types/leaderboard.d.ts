export type TopParticipantsTypes = {
  totalMarks: number;
  totalQuizMarks: number;
  totalAttempts: number;
  userId: string;
  name: string;
  email: string;
  rank: number;
  badge?: string;
  avatar?: string;
};

export type TopParticipantsResponse = {
  success: boolean;
  code: number;
  message: string;
  data: TopParticipantsTypes[];
}
