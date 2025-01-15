import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle, HelpCircle, Square, Radio } from 'lucide-react';
import { cn } from '@/libs/utils';
import { useAppSelector, useAppDispatch } from '@/libs/hooks';
import { closeParticipateQuizModal } from '@/libs/features/modal/modalSlice';
import { onSelectQuiz } from '@/libs/features/participantQuiz/participantQuizSlice';
import Header from './Header';
import Modal from '../common/Modal';

interface QuizModalProps {
  isOpen: boolean;
}

export default function QuizModal({ isOpen }: QuizModalProps) {
  const dispatch = useAppDispatch()
  const selectedQuiz = useAppSelector(state => state.participantQuiz.selectedQuiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Early return to avoid rendering the modal if conditions aren't met
  if (!isOpen || !selectedQuiz || !selectedQuiz.questions || selectedQuiz.questions.length === 0) {
    return null;
  }

  const onCloseHandler = () => {
    dispatch(closeParticipateQuizModal());
    dispatch(onSelectQuiz(null))
  }

  const handleAnswerSelect = (questionId: string, optionIndex: string) => {
    const question = selectedQuiz.questions[currentQuestionIndex];
    if (question.type === 'single') {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: [optionIndex]
      }));
    } else {
      const currentAnswers = selectedAnswers[questionId] || [];
      const updatedAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(a => a !== optionIndex)
        : [...currentAnswers, optionIndex];
      setSelectedAnswers(prev => ({
        ...prev,
        [questionId]: updatedAnswers
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Submit logic here
    setIsSubmitting(false);
    // onClose();
  };

  // if (!isOpen ) return null;

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <Modal onClose={onCloseHandler}>
      {/* Header */}
      <Header title={selectedQuiz.title} description={selectedQuiz.description} timeLeft={timeLeft} onClose={onCloseHandler} />

      {/* Progress */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1}/{selectedQuiz.questions.length}</span>
        </div>
        <div className="h-1.5 bg-[#343434] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-400">Question {currentQuestionIndex + 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Points:</span>
            <span className="text-sm font-medium text-green-500">{currentQuestion.points}</span>
          </div>
        </div>

        <h3 className="text-xl text-white font-medium mb-4">{currentQuestion.text}</h3>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#343434] text-sm mb-6">
          <span className="text-gray-400">Type:</span>
          <span className="text-white font-medium">
            {currentQuestion.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
          </span>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion.id, index.toString())}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                selectedAnswers[currentQuestion.id]?.includes(index.toString())
                  ? "bg-green-500/10 border-green-500 text-white"
                  : "bg-[#343434] border-gray-700 text-gray-300 hover:border-green-500/50"
              )}
            >
              <div className="flex items-center space-x-3">
                {currentQuestion.type === 'single' ? (
                  <Radio className={cn(
                    "w-5 h-5",
                    selectedAnswers[currentQuestion.id]?.includes(index.toString())
                      ? "text-green-500"
                      : "text-gray-600"
                  )} />
                ) : (
                  <Square className={cn(
                    "w-5 h-5",
                    selectedAnswers[currentQuestion.id]?.includes(index.toString())
                      ? "text-green-500"
                      : "text-gray-600"
                  )} />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center text-gray-400">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {currentQuestion.type === 'single'
              ? 'Select one answer to continue'
              : 'Select one or more answers to continue'}
          </span>
        </div>
        {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
            className="flex items-center px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Question
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedAnswers[currentQuestion.id]}
            className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </Modal>
  );
}
