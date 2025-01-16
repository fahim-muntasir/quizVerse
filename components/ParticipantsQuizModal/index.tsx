"use client"
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/libs/hooks';
import { closeParticipateQuizModal } from '@/libs/features/modal/modalSlice';
import { onSelectQuiz } from '@/libs/features/participantQuiz/participantQuizSlice';
import Header from './Header';
import Modal from '../common/Modal';
import ProgressBar from './ProgressBar';
import QuestionOption from '../common/QuestionOption';
import Footer from './Footer';
import Question from '../common/Question';

export default function QuizModal() {
  const dispatch = useAppDispatch()
  const selectedQuiz = useAppSelector(state => state.participantQuiz.selectedQuiz);
  const isOpen = useAppSelector(
    (state) => state.modal.participateQuizModal.isOpen
  );

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
      <ProgressBar currentQuestionIndex={currentQuestionIndex} questionLength={selectedQuiz.questions.length} />

      {/* Question */}
      <div className="p-6">
        <Question currentQuestionIndex={currentQuestionIndex} marks={currentQuestion.points} type={currentQuestion.type} text={currentQuestion.text} />

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <QuestionOption key={index} onClickHandler={() => handleAnswerSelect(currentQuestion.id, index.toString())} selectedAnswers={selectedAnswers[currentQuestion.id]} questionType={currentQuestion.type} option={option} index={index.toString()} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer questionType={currentQuestion.type} currentQuestionIndex={currentQuestionIndex} selectedQuizQuestionLength={selectedQuiz.questions.length} selectedAnswers={selectedAnswers[currentQuestion.id]} handleNext={handleNext} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Modal>
  );
}
