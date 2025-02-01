export type CreateResultType = {
  selectedAnswers: Record<string, string[]>;
  quizId: string;
  takenTime: number;
}

export interface QuizResultResponse {
  success: boolean;
  code: number;
  message: string;
  data: QuizResultData;
  links: {
    self: string;
  };
}

export interface QuizResultData {
  _id: string;
  takenTime: number;
  totalMarks: number;
  isPublished: boolean;
  totalQuestion: number;
  correctAnswer: number;
  selectedAnswers: Record<string, string[]>; // Object where keys are question IDs and values are selected answers
  results: QuizResult[];
  quiz: string; // Quiz ID
  user: string; // User ID
}

export interface QuizResult {
  question: QuizQuestion;
  isCorrectAnswer: boolean;
  _id: string;
}

export interface QuizQuestion {
  _id: string;
  text: string;
  type: "single" | "multiple"; // Define the types of quiz questions
  options: string[];
  correctAnswer: string[];
  marks: number;
  quizId: string;
  createdAt: string;
  updatedAt: string;
}
