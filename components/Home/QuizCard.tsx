"use client";
import Link from "next/link";
import {
  Clock,
  Users,
  Share2,
  Trash2,
  Award,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Play,
} from "lucide-react";
import { cn } from "@/libs/utils";
import { useState } from "react";
import { useAppDispatch } from "@/libs/hooks";
import { openParticipateQuizModal } from "@/libs/features/modal/modalSlice";
import { onSelectQuiz } from "@/libs/features/participantQuiz/participantQuizSlice";
import { Quiz } from "@/types/quiz";

type QuizCardProps = { quiz: Quiz };

export function QuizCard({ quiz }: QuizCardProps) {
  const {
    id,
    title,
    description,
    category,
    participants,
    duration,
    difficulty,
    totalMarks,
    activeStatus,
  } = quiz;
  const [isActive, setIsActive] = useState(activeStatus);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const dispatch = useAppDispatch();

  const participateHandler = () => {
    dispatch(onSelectQuiz(quiz));
    dispatch(openParticipateQuizModal());
  };

  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-500 border-red-500/20",
  }[difficulty];

  const handleShare = (platform: "copy" | "twitter" | "facebook") => {
    const quizUrl = `${window.location.origin}/quiz/${id}`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(quizUrl);
        // Show toast notification
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            quizUrl
          )}&text=Check out this quiz: ${title}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            quizUrl
          )}`
        );
        break;
    }
    setShowShareMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      // Implementation needed
      console.log("Delete quiz:", id);
    }
  };

  return (
    <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6 hover:border-green-500/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span
              className={cn(
                "text-sm px-3 py-1 rounded-full border",
                difficultyColor
              )}
            >
              {difficulty}
            </span>
            <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-400" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#343434] border border-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleShare("copy")}
                    className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                  >
                    Share on Twitter
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 text-left"
                  >
                    Share on Facebook
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>

          {/* Toggle Button */}
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            {isActive ? (
              <ToggleRight className="w-5 h-5 text-green-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <p className="text-gray-400 mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {participants} participants
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 mr-1" />
            {totalMarks} marks
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/quiz/${id}/results`}
            className="flex items-center text-green-500 hover:text-green-400 transition-colors"
          >
            View Results
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>

          <button
            onClick={() => participateHandler()}
            className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Play className="w-4 h-4" />
            Participate
          </button>
        </div>
      </div>
    </div>
  );
}
