import React from "react";
import { Users, Clock, Award, ChevronRight, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { openParticipateQuizModal } from "@/libs/features/modal/modalSlice";
import { onSelectQuiz } from "@/libs/features/participantQuiz/participantQuizSlice";
import { Quiz } from "@/types/quiz";
import { isParticipantResponse } from "@/utils/typeGuards";
import { useCheckParticipatsQuery } from "@/libs/features/participantQuiz/participatsApiSlice";

export const QuizCardFooter: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useCheckParticipatsQuery(quiz._id, {
    skip: !user, // Prevent call if user is not logged in
  });

  const participateHandler = () => {
    dispatch(onSelectQuiz(quiz));
    dispatch(openParticipateQuizModal());
  };

  let element = (
    <button
      onClick={participateHandler}
      className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
    >
      <Play className="w-4 h-4" />
      Participate
    </button>
  );

  if (isLoading) {
    element = (
      <div className="flex items-center text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="ml-2">Checking...</span>
      </div>
    );
  }

  if (data && isParticipantResponse(data) && data.data) {
    // Safely access hasParticipated
    if (data.data.hasParticipated) {
      element = (
        <Link
          href={`/quiz/${quiz._id}/results`}
          className="flex items-center text-green-500 hover:text-green-400 transition-colors"
        >
          View Results
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      );
    }
  }

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

      <div className="flex items-center gap-4">{element}</div>
    </div>
  );
};
