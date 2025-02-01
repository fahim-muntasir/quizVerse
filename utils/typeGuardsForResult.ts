import { QuizResultResponse } from "@/types/result";

export function isQuizResultResponse(data: unknown): data is QuizResultResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as QuizResultResponse).success === "boolean" &&
    typeof (data as QuizResultResponse).code === "number" &&
    typeof (data as QuizResultResponse).message === "string" &&
    typeof (data as QuizResultResponse).data === "object" &&
    typeof (data as QuizResultResponse).data._id === "string" &&
    typeof (data as QuizResultResponse).data.takenTime === "number" &&
    typeof (data as QuizResultResponse).data.totalMarks === "number" &&
    typeof (data as QuizResultResponse).data.isPublished === "boolean" &&
    typeof (data as QuizResultResponse).data.totalQuestion === "number" &&
    typeof (data as QuizResultResponse).data.correctAnswer === "number" &&
    typeof (data as QuizResultResponse).data.quiz === "string" &&
    typeof (data as QuizResultResponse).data.user === "string" &&
    typeof (data as QuizResultResponse).links === "object" &&
    typeof (data as QuizResultResponse).links.self === "string"
  );
}