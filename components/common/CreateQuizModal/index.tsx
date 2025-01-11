"use client";
import React, { useState } from "react";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Footer from "./Footer";
import {
  Question,
  CreateQuizModalProps,
  QuizDetails,
} from "@/types/quizCreateModal";
import QuizDetailsForm from "./QuizDetailsForm";
import QuestionForm from "./QuestionForm";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { InitialValues } from "@/types/quizCreateModal";

const quizCreationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters long")
    .required("Title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters long")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  duration: Yup.number()
    .min(1, "Duration must be at least 1 minute")
    .required("Duration is required"),
  difficulty: Yup.string()
    .oneOf(["Easy", "Medium", "Hard"], "Invalid difficulty")
    .required("Difficulty is required"),
  questions: Yup.array().of(
    Yup.object({
      text: Yup.string().required("Question text is required"),
      type: Yup.string()
        .oneOf(["multiple", "single"], "Invalid question type")
        .required("Question type is required"),
      options: Yup.array()
        .of(Yup.string().required("Option cannot be empty"))
        .min(2, "At least 2 options are required")
        .max(6, "Cannot have more than 6 options"),
      correctAnswer: Yup.array()
        .min(1, "At least one correct answer is required")
        .required("Correct answer is required"),
      marks: Yup.number()
        .min(1, "Marks must be at least 1")
        .required("Marks are required"),
    })
  ),
});

export default function CreateQuizModal({ isOpen }: CreateQuizModalProps) {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState<QuizDetails>({
    title: "",
    description: "",
    category: "",
    duration: 30,
    difficulty: "Easy",
    totalMarks: 0,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: "",
    type: "multiple",
    options: ["", ""],
    correctAnswer: [],
    marks: 1,
  });

  const initialValues: InitialValues = {
    title: "", // From quizDetails
    description: "", // From quizDetails
    category: "", // From quizDetails
    duration: 30, // From quizDetails
    difficulty: "Easy", // From quizDetails
    totalMarks: 0, // From quizDetails
    questions: [
      {
        text: "", // From currentQuestion
        type: "multiple", // From currentQuestion
        options: ["", ""], // From currentQuestion
        correctAnswer: [], // From currentQuestion
        marks: 1, // From currentQuestion
      },
    ],
  };

  const addQuestion = () => {
    if (currentQuestion.text && (currentQuestion.options?.length ?? 0) >= 2) {
      const newQuestion: Question = {
        // id: Date.now().toString(),
        text: currentQuestion.text || "",
        type: currentQuestion.type || "multiple",
        options: currentQuestion.options || [],
        correctAnswer: currentQuestion.correctAnswer || [],
        marks: currentQuestion.marks || 1,
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        text: "",
        type: "multiple",
        options: ["", ""],
        correctAnswer: [],
        marks: 1,
      });
      updateTotalMarks([...questions, newQuestion]);
    }
  };

  const removeQuestion = (id: number) => {
    const updatedQuestions = questions.filter((q, index) => index !== id);
    setQuestions(updatedQuestions);
    updateTotalMarks(updatedQuestions);
  };

  const updateTotalMarks = (updatedQuestions: Question[]) => {
    const total = updatedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);
    setQuizDetails((prev) => ({ ...prev, totalMarks: total }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addOption = () => {
    if (currentQuestion.options && currentQuestion.options.length < 6) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options && currentQuestion.options.length > 2) {
      const newOptions = currentQuestion.options.filter((_, i) => i !== index);
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1C1C1C] w-full max-w-4xl rounded-lg shadow-xl">
        <Formik
          initialValues={initialValues}
          onSubmit={() => {
            console.log("Submited....");
          }}
          validationSchema={quizCreationSchema}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Heaser  */}
              <Header />

              {/* Progress Steps */}
              <ProgressBar step={step} />

              {/* Content */}
              <div className="p-6 max-h-[600px] overflow-auto">
                {step === 1 ? (
                  /* Quiz Details Form */
                  <QuizDetailsForm />
                ) : (
                  /* Questions Form */
                  <QuestionForm
                    questions={questions}
                    removeQuestion={removeQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    currentQuestion={currentQuestion}
                    handleOptionChange={handleOptionChange}
                    removeOption={removeOption}
                    addOption={addOption}
                    addQuestion={addQuestion}
                  />
                )}
              </div>

              {/* Footer */}
              <Footer
                step={step}
                setStep={setStep}
                quizDetails={quizDetails}
                questions={questions}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
