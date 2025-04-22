type QuizDifficulty = "Easy" | "Medium" | "Hard";
type QuestionType = "single" | "multiple";

export type Question = {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: string[];
  type: QuestionType;
  marks: number;
  quizId: string;
  createdAt: string;
  updatedAt: string;
};

export type Quiz = {
  _id: string;
  category: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  questions: Question[];
  title: string;
  totalMarks: number;
  status: string;
  totalParticipants: number;
  user: string;
  isParticipated?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuizResponseType = {
  code: number;
  data: Quiz[];
  links: {
    self: string;
  };
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
    totalItems: number;
  };
  success: boolean;
};

type QuizResultData = {
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: string;
  questions: {
    id: string;
    text: string;
    userAnswer: string[];
    correctAnswer: string[];
    options: string[];
    explanation?: string;
    type: QuestionType;
    isCorrectAnswer: boolean;
  }[];
};
