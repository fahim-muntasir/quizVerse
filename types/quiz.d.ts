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
  category: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  questions: string[];
  title: string;
  totalMarks: number;
  status: string;
  user: string;
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
