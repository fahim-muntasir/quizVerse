"use client"
import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/libs/hooks';
import { closeParticipateQuizModal } from '@/libs/features/modal/modalSlice';
import { onSelectQuiz } from '@/libs/features/participantQuiz/participantQuizSlice';
import Header from './Header';
import Modal from '../common/Modal';
import ProgressBar from './ProgressBar';
import QuestionOption from '../common/QuizOption';
import Footer from './Footer';
import Question from '../common/Question';
import { isQuiz } from '@/utils/typeGuards';
import { useCreateResultMutation } from '@/libs/features/result/resultApiSlice';
import SubmissionSuccess from './SubmissionSuccess';
import toast from 'react-hot-toast';
import { quizApiSlice } from '@/libs/features/quiz/quizApiSlice';

export default function QuizModal({ page }: { page: number }) {
  const dispatch = useAppDispatch()
  const [createResult, { isSuccess }] = useCreateResultMutation();
  const selectedQuiz = useAppSelector(state => state.participantQuiz.selectedQuiz);
  const isOpen = useAppSelector(
    (state) => state.modal.participateQuizModal.isOpen
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setQuizSubmitted(true)
    }
  }, [isSuccess])

  useEffect(() => {
    if (selectedQuiz && isQuiz(selectedQuiz)) {
      setTimeLeft(selectedQuiz.duration * 60); // Assuming duration is in minutes, convert to seconds
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const onCloseHandler = () => {
    dispatch(closeParticipateQuizModal());
    dispatch(onSelectQuiz(null));
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  }

  if (!isOpen || !isQuiz(selectedQuiz)) {
    return null; // Ensures the modal doesn't render if the quiz is invalid
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

    try {
      const takenTime = Math.floor(selectedQuiz.duration * 60) - timeLeft;

      await createResult({
        selectedAnswers,
        quizId: selectedQuiz._id,
        takenTime
      })

      dispatch(
        quizApiSlice.util.updateQueryData(
          "getQuizzes",
          { page, limit: 10 }, 
          (draftQuizzes) => {
            if (!draftQuizzes || !draftQuizzes.data) return;

            console.log("Before update:", JSON.stringify(draftQuizzes, null, 2));

            // Remove the participated quiz
            draftQuizzes.data = draftQuizzes.data.filter(
              (quiz) => quiz._id !== selectedQuiz._id
            );

            console.log("After update:", JSON.stringify(draftQuizzes, null, 2));
          }
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }

    setIsSubmitting(false);
  };

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <Modal>
      {/* Header */}
      <Header title={selectedQuiz.title} description={selectedQuiz.description} timeLeft={timeLeft} onClose={onCloseHandler} isQuizSubmitted={quizSubmitted} />

      {quizSubmitted && (
        <div className='p-5'>
          <SubmissionSuccess onClose={onCloseHandler} />
        </div>
      )}

      {!quizSubmitted &&
        <>{/* Progress */}
          <ProgressBar currentQuestionIndex={currentQuestionIndex} questionLength={selectedQuiz.questions.length} />

          {/* Question */}
          <div className="p-6">
            <Question currentQuestionIndex={currentQuestionIndex} marks={currentQuestion.marks} type={currentQuestion.type} text={currentQuestion.text} />

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <QuestionOption key={index} onClickHandler={() => handleAnswerSelect(currentQuestion._id, index.toString())} selectedAnswers={selectedAnswers[currentQuestion._id]} questionType={currentQuestion.type} option={option} index={index.toString()} />
              ))}
            </div>
          </div>

          {/* Footer */}
          <Footer questionType={currentQuestion.type} currentQuestionIndex={currentQuestionIndex} selectedQuizQuestionLength={selectedQuiz.questions.length} selectedAnswers={selectedAnswers[currentQuestion._id]} handleNext={handleNext} handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </>}
    </Modal>
  );
}
