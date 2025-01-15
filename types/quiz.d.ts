type QuizDifficulty = "Easy" | "Medium" | "Hard";
type QuestionType = "single" | "multiple";

export type Question = {
  id: string;
  text: string;
  options: string[];
  type: QuestionType;
  points: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  participants: number;
  duration: string;
  difficulty: QuizDifficulty;
  totalMarks: number;
  admin: string;
  activeStatus: boolean;
  questions: Question[];
};
