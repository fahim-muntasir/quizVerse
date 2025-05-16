"use client"
import React from 'react'
import { cn } from "@/libs/utils";
import { Trash2, Users, Clock, Award, Play } from "lucide-react";
import { useAppDispatch } from '@/libs/hooks';
import { openParticipateQuizModal } from '@/libs/features/modal/modalSlice';
import { onSelectQuiz } from '@/libs/features/participantQuiz/participantQuizSlice';

export default function SingleQuiz() {
  const dispatch = useAppDispatch();

  const participantsQuizHandler = () => {
    dispatch(onSelectQuiz({
      _id: "quiz123",
      category: "JavaScript",
      description: "A basic quiz to test your JavaScript knowledge.",
      difficulty: "Easy",
      duration: 15,
      questions: [
        {
          _id: "q1",
          text: "Which of the following is a JavaScript data type?",
          options: ["Number", "Function", "Document", "HTML"],
          correctAnswer: ["Number"],
          type: "single",
          marks: 2,
          quizId: "quiz123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "q2",
          text: "Which of these are JavaScript frameworks?",
          options: ["React", "Angular", "Laravel", "Vue"],
          correctAnswer: ["React", "Angular", "Vue"],
          type: "multiple",
          marks: 3,
          quizId: "quiz123",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      title: "JavaScript Basics Quiz",
      totalMarks: 5,
      status: "active",
      totalParticipants: 0,
      user: "user123",
      isParticipated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    dispatch(openParticipateQuizModal());
  }

  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-500 border-red-500/20",
  }["Easy"];

  return (
    <div className="bg-background border border-gray-800 rounded-md p-4 hover:border-green-500/50 transition-all text-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                difficultyColor
              )}
            >
              Easy
            </span>
            <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
              Programming
            </span>
          </div>
          <h3 className="text-base font-semibold text-white mb-1 leading-tight">
            This is a test quizzes
          </h3>
        </div>

        <button className="p-1 hover:bg-gray-800 rounded-full transition-colors">
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <p className="text-gray-400 mb-3 text-xs leading-snug">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et, sed.
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-gray-400">
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            5
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            10m
          </div>
          <div className="flex items-center">
            <Award className="w-3 h-3 mr-1" />
            10
          </div>
        </div>

        <button onClick={participantsQuizHandler} className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs">
          <Play className="w-3 h-3" />
          Start
        </button>
      </div>
    </div>
  )
}
