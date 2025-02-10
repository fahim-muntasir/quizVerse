import { Quiz, QuizResponseType } from "@/types/quiz";
import { AuthResponse } from "@/types/auth";
import { ParticipantResponseType } from "@/types/participants";
// Type guard for a single Quiz object
// export const isQuiz = (quiz: unknown): quiz is Quiz => {
//   if (typeof quiz !== "object" || quiz === null) return false;

//   const q = quiz as Record<string, unknown>;

//   return (
//     typeof q.category === "string" &&
//     typeof q.createdAt === "string" &&
//     typeof q.description === "string" &&
//     (q.difficulty === "Easy" || q.difficulty === "Medium" || q.difficulty === "Hard") &&
//     typeof q.duration === "number" &&
//     Array.isArray(q.questions) &&
//     q.questions.every((question) => typeof question === "string") &&
//     typeof q.title === "string" &&
//     typeof q.totalMarks === "number" &&
//     typeof q.status === "string" &&
//     typeof q.updatedAt === "string" &&
//     typeof q.user === "string" &&
//     typeof q._id === "string"
//   );
// };

export const isQuiz = (quiz: unknown): quiz is Quiz => {
  if (typeof quiz !== "object" || quiz === null) return false;

  const q = quiz as Record<string, unknown>;

  return (
    typeof q.category === "string" &&
    typeof q.createdAt === "string" &&
    typeof q.description === "string" &&
    (q.difficulty === "Easy" || q.difficulty === "Medium" || q.difficulty === "Hard") &&
    typeof q.duration === "number" &&
    Array.isArray(q.questions) &&
    q.questions.every((question) =>
      typeof question === "object" &&
      question !== null &&
      typeof question._id === "string" &&
      typeof question.text === "string" &&
      typeof question.type === "string" &&
      Array.isArray(question.options) &&
      question.options.every((opt: unknown) => typeof opt === "string") &&
      typeof question.marks === "number" &&
      typeof question.updatedAt === "string" &&
      typeof question.createdAt === "string" &&
      Array.isArray(question.correctAnswer) &&
      question.correctAnswer.every((opt: unknown) => typeof opt === "string") &&
      typeof question.quizId === "string" // This should be inside the question, not the quiz
    ) &&
    typeof q.title === "string" &&
    typeof q.totalMarks === "number" &&
    typeof q.status === "string" && // Could use a stricter enum check
    typeof q.updatedAt === "string" &&
    typeof q.user === "string" &&
    typeof q._id === "string"
  );
};


// Type guard for QuizResponse
export const isQuizResponse = (data: unknown): data is QuizResponseType => {
  if (typeof data !== "object" || data === null) return false;

  const d = data as Record<string, unknown>;

  return (
    typeof d.code === "number" &&
    Array.isArray(d.data) &&
    d.data.every(isQuiz) &&
    typeof d.links === "object" &&
    d.links !== null &&
    typeof (d.links as Record<string, unknown>).self === "string" &&
    typeof d.message === "string" &&
    typeof d.pagination === "object" &&
    d.pagination !== null &&
    typeof (d.pagination as Record<string, unknown>).page === "number" &&
    typeof (d.pagination as Record<string, unknown>).limit === "number" &&
    typeof (d.pagination as Record<string, unknown>).totalPage === "number" &&
    typeof (d.pagination as Record<string, unknown>).totalItems === "number" &&
    typeof d.success === "boolean"
  );
};

// Type guard function
export function isAuthResponse(response: unknown): response is AuthResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    typeof (response as Record<string, unknown>).code === "number" &&
    typeof (response as Record<string, unknown>).data === "object" &&
    typeof ((response as Record<string, unknown>).data as Record<string, unknown>).token === "string" &&
    typeof ((response as Record<string, unknown>).data as Record<string, unknown>).user === "object" &&
    typeof (((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).id) === "string" &&
    typeof ((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).fullName === "string" &&
    typeof ((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).email === "string" &&
    typeof ((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).role === "string" &&
    typeof ((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).createdAt === "string" &&
    typeof ((response as Record<string, { user: unknown }>).data.user as Record<string, unknown>).updatedAt === "string" &&
    typeof (response as Record<string, unknown>).links === "object" &&
    typeof ((response as Record<string, unknown>).links as Record<string, unknown>).self === "string" &&
    typeof (response as Record<string, unknown>).message === "string" &&
    typeof (response as Record<string, unknown>).success === "boolean"
  );
}

export const isParticipantResponse = (data: unknown): data is ParticipantResponseType => {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;
  const dataField = obj.data as Record<string, unknown> | null;

  return (
    typeof obj.success === "boolean" &&
    typeof obj.message === "string" &&
    typeof obj.code === "number" &&
    typeof dataField === "object" &&
    dataField !== null &&
    typeof dataField.hasParticipated === "boolean" &&
    typeof dataField._id === "string"
  );
};
