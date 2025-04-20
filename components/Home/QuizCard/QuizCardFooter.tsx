import React from "react";
import { Users, Clock, Award, ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { useAppDispatch } from "@/libs/hooks";
import { openParticipateQuizModal } from "@/libs/features/modal/modalSlice";
import { onSelectQuiz } from "@/libs/features/participantQuiz/participantQuizSlice";
import { Quiz } from "@/types/quiz";
export const QuizCardFooter: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const dispatch = useAppDispatch();

  const participateHandler = () => {
    dispatch(onSelectQuiz(quiz));
    dispatch(openParticipateQuizModal());
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          100 participants
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {quiz.duration} min
        </div>
        <div className="flex items-center">
          <Award className="w-4 h-4 mr-1" />
          {quiz.totalMarks} marks
        </div>
      </div>

      <div className="flex items-center gap-4">
        {quiz.isParticipated && <Link
          href={`/quiz/${quiz._id}/results`}
          className="flex items-center text-green-500 hover:text-green-400 transition-colors"
        >
          View Results
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>}
        {!quiz.isParticipated && <button
          onClick={participateHandler}
          className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <Play className="w-4 h-4" />
          Participate
        </button>}
      </div>
    </div>
  );
};
