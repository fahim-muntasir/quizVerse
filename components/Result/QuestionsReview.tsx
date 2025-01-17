import React from 'react'
import { QuizResultData } from '@/types/quiz';
import Question from '../common/Question';
import Explanation from './Explanation';
import ResultOption from '../common/ResultOption';

export default function QuestionsReview() {
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
        userAnswer: ["1"],
        correctAnswer: ["2"],
        options: ["London", "Berlin", "Paris", "Madrid"],
        explanation: "Paris is the capital city of France.",
        type: "single",
        isCorrectAnswer: false,
      },
      {
        id: "2",
        text: "Select all programming languages",
        userAnswer: ["0", "1", "3"],
        correctAnswer: ["0", "1", "3"],
        options: ["Python", "JavaScript", "Banana", "Java"],
        explanation: "Python, JavaScript, and Java are programming languages, while Banana is a fruit.",
        type: "multiple",
        isCorrectAnswer: true,
      }
    ]
  };

  return (
    <div className="space-y-6">
      {result.questions.map((question, index) => (
        <div key={question.id} className="bg-background backdrop-blur-lg rounded-lg p-6 border border-gray-800">
          <Question currentQuestionIndex={index} marks={50} type={question.type} text={question.text} isCorrectAnswer={question.isCorrectAnswer} />

          <div className="space-y-3">
            {question.options.map((option, optionIndex) => (
              <ResultOption key={optionIndex} index={optionIndex.toString()} selectedAnswers={question.userAnswer} questionType={question.type} option={option} correctAnswer={question.correctAnswer} />
            ))}
          </div>

          {question.explanation && (
            <Explanation text={question.explanation} />
          )}
        </div>
      ))}
    </div>
  )
}
