"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { QuizCard } from "../Home/QuizCard/QuizCard";
import ParticipantsQuizModal from "@/components/ParticipantsQuizModal";
import { useGetUserQuizzesQuery } from "@/libs/features/quiz/quizApiSlice";
import QuizCardLoader from "../Home/QuizCardLoader";
import { isQuizResponse } from "@/utils/typeGuards";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { setUserQuizzes } from "@/libs/features/quiz/quizSlice";
import Error from "../common/Error";
import { useParams } from "next/navigation";

export default function CreatedQuizList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || ""; // Get search query from URL
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const duration = searchParams.get("duration") || "";
  const { userId } = useParams();

  const [hasData, setHasData] = useState(false);
  const [page, setPage] = useState(1);
  const { userQuizzes } = useAppSelector((state => state.quiz));
  const dispatch = useAppDispatch();

  const { data: quizzes, isLoading, isError, isSuccess } = useGetUserQuizzesQuery({
    page,
    limit: 10,
    searchQuery,
    category,
    difficulty,
    duration,
    userId: userId as string,
  });

  // Validate API response type
  const isValidResponse = quizzes && isQuizResponse(quizzes);

  // Reset quizzes when search query changes
  useEffect(() => {
    setPage(1);
    dispatch(setUserQuizzes([]));
  }, [searchQuery, dispatch]);

  // Append new quizzes when API fetch is successful
  useEffect(() => {
    if (isSuccess && isValidResponse) {

      if (page === 1) {
        dispatch(setUserQuizzes(quizzes.data));
      } else {
        const newQuizzes = quizzes.data.filter(
          (newQuiz) => !userQuizzes.some((prevQuiz) => prevQuiz._id === newQuiz._id)
        );
        const allUserQuizzes = [...userQuizzes, ...newQuizzes];
        dispatch(setUserQuizzes(allUserQuizzes));
      }
    }
  }, [isSuccess, isValidResponse, quizzes, page, dispatch, userQuizzes]);

  // Infinite Scroll Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastQuizElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isValidResponse && page < quizzes.pagination.totalPage) {
          setHasData(true);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasData(false);
        }
      });
      if (node) observer.current.observe(node);
    },
    [page, quizzes, isValidResponse]
  );

  // Render Quiz Cards
  const renderQuizCards = () => {
    if (userQuizzes.length === 0 && !isLoading) {
      return <div className="text-white">No quizzes available</div>;
    }
    return userQuizzes.map((quiz, index) => (
      <QuizCard
        key={quiz._id} // Use _id for uniqueness
        quiz={quiz}
        ref={index === userQuizzes.length - 1 ? lastQuizElementRef : undefined}
      />
    ));
  };

  return (
    <>
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-white mb-6">Your participation</h2>
        <div className="grid gap-6">
          {isLoading ? <><QuizCardLoader /> <QuizCardLoader /> <QuizCardLoader /></> : renderQuizCards()}
          {hasData && <><QuizCardLoader /> <QuizCardLoader /></>}
          {isError && <Error msg="Error fetching quizzes" />}
        </div>
      </div>
      <ParticipantsQuizModal />
    </>
  );
}
