export type Question = {
  // id: string;
  text: string;
  type: "multiple" | "single" | "text";
  options: string[];
  correctAnswer: string[] | string;
  marks: number;
};

export type CreateQuizModalProps = {
  isOpen: boolean;
  // onClose: () => void;
};

export type QuizDetails = {
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  totalMarks: number;
};

export type InitialValues = QuizDetails & {
  questions: Question[];
};
