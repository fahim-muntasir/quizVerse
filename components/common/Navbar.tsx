"use client";
import React from "react";
import { BookOpenCheck, LogIn, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/libs/hooks";
import { openCreateQuizModal } from "@/libs/features/modal/modalSlice";
import Link from "next/link";
import CreateQuizModal from "../CreateQuizModal";

export function Navbar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.createQuizModal.isOpen);

  const createQuizHandler = () => {
    dispatch(openCreateQuizModal());
  };

  return (
    <>
      <nav className="bg-[#1C1C1C] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-green-500/10 p-2 rounded-full">
                <BookOpenCheck className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-white font-bold text-xl">QuizVerse</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={createQuizHandler}
                className="flex items-center px-3 py-1 rounded-md border border-primary  bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </button>
              <Link
                href="/auth"
                className="flex items-center px-3 py-1 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <CreateQuizModal isOpen={isOpen} />
    </>
  );
}
