import React from "react";
import { QuizCard } from "./QuizCard";
import ParticipantsQuizModal from "@/components/ParticipantsQuizModal";

// Mock data (replace with real data later)
const quizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control flow.",
    category: "Programming",
    participants: 1234,
    duration: "30 mins",
    difficulty: "Easy" as const,
    totalMarks: 100,
    admin: "john@example.com",
    activeStatus: true,
    questions: [
      {
        id: "q1",
        text: "What is JavaScript?",
        options: [
          "A programming language",
          "A markup language",
          "A database",
          "A server",
        ],
        type: "single" as const,
        points: 5,
      },
      {
        id: "q2",
        text: "Which of these are valid JavaScript data types?",
        options: ["String", "Number", "Boolean", "All of the above"],
        type: "single" as const,
        points: 5,
      },
    ],
  },
  // Add more quizzes here
];

export default function QuizList() {
  return (
    <>
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Available Quizzes
        </h2>
        <div className="grid gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
      <ParticipantsQuizModal />
    </>
  );
}
