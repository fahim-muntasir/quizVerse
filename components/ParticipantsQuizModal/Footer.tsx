import React from 'react'
import { ChevronRight, AlertCircle } from 'lucide-react';

type FooterProps = {
  questionType: string;
  currentQuestionIndex: number;
  selectedQuizQuestionLength: number;
  handleNext: () => void;
  selectedAnswers: string[];
  handleSubmit: () => void;
  isSubmitting: boolean

}

export default function Footer({ questionType, currentQuestionIndex, selectedQuizQuestionLength, handleNext, selectedAnswers, handleSubmit, isSubmitting }: FooterProps) {
  return (
    <div className="border-t border-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center text-gray-400">
        <AlertCircle className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {questionType === 'single'
            ? 'Select one answer to continue'
            : 'Select one or more answers to continue'}
        </span>
      </div>
      {currentQuestionIndex < selectedQuizQuestionLength - 1 ? (
        <button
          onClick={handleNext}
          disabled={!selectedAnswers}
          className="flex items-center px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Question
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedAnswers}
          className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      )}
    </div>
  )
}
