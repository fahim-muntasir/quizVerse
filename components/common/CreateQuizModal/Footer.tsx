import React from "react";
import { StepForward, StepBack } from "lucide-react";
import { Question, QuizDetails } from "@/types/quizCreateModal";

type FooterProps = {
  step: number;
  setStep: (set: number) => void;
  quizDetails: QuizDetails;
  questions: Question[];
};

export default function Footer({
  step,
  setStep,
  quizDetails,
  questions,
}: FooterProps) {
  return (
    <div className="border-t border-gray-800 p-4 flex justify-between">
      {step === 1 ? (
        <div className="flex justify-end w-full">
          <button
            onClick={() => setStep(2)}
            disabled={!quizDetails?.title || !quizDetails?.category}
            className="px-4 flex items-center justify-center py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <StepForward className="w-5 h-5 ml-1" />
          </button>
        </div>
      ) : (
        <div className="flex justify-between w-full">
          <button
            onClick={() => setStep(1)}
            className="px-4 flex items-center py-2 text-white hover:text-green-400 transition-colors"
          >
            <StepBack className="w-5 h-5 mr-1" /> Back
          </button>
          <button
            onClick={() => {
              // Handle quiz creation
              console.log({ ...quizDetails, questions });
              // onClose();
            }}
            disabled={questions.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Quiz ({questions.length})
          </button>
        </div>
      )}
    </div>
  );
}
