import React from 'react';
import { BackgroundPattern } from '@/components/background/BackgroundPattern';
import Header from '@/components/Result/Header';
import Banner from '@/components/Result/Banner';
import Stats from '@/components/Result/Stats';
import { QuizResultData } from '@/types/quiz';
import QuestionsReview from '@/components/Result/QuestionsReview';

export default function QuizResult() {
  // Mock data (replace with real data from your backend)
  const result: QuizResultData = {
    quizTitle: "JavaScript Fundamentals",
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    timeTaken: "25:30",
    questions: [
      {
        id: "1",
        text: "What is the capital of France?",
        userAnswer: ["2"],
        correctAnswer: ["2"],
        options: ["London", "Berlin", "Paris", "Madrid"],
        explanation: "Paris is the capital city of France.",
        type: "single",
      },
      {
        id: "2",
        text: "Select all programming languages",
        userAnswer: ["0", "1", "3"],
        correctAnswer: ["0", "1", "3"],
        options: ["Python", "JavaScript", "Banana", "Java"],
        explanation: "Python, JavaScript, and Java are programming languages, while Banana is a fruit.",
        type: "multiple"
      }
    ]
  };


  return (
    <div className="min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
      <BackgroundPattern />
      <div className="max-w-4xl mx-auto">
        {/* Branding Header */}
        <Header />

        {/* Achievement Banner */}
        <Banner score={result.score} quizTitle={result.quizTitle} />

        {/* Stats Grid */}
        <Stats timeTaken={result.timeTaken} correctAnswers={result.correctAnswers} totalQuestions={result.totalQuestions} />

        {/* Questions Review */}
        <QuestionsReview />

        {/* Call-to-Action Footer */}
        <div className="mt-12 bg-background backdrop-blur-lg rounded-lg p-6 text-center border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-2">Ready for Another Challenge?</h3>
          <p className="text-gray-400 mb-4">Test your knowledge with more quizzes on QuizLingo</p>
          <button
            // onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Explore More Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}