"use client";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import ProgressBar from "./ProgressBar";
import Footer from "./Footer";
import { CreateQuizModalProps } from "@/types/quizCreateModal";
import QuizDetailsForm from "./QuizDetailsForm";
import QuestionForm from "./QuestionForm";
import { Formik, Form, FormikHelpers } from "formik";
import { InitialValues } from "@/types/quizCreateModal";
import { quizCreationSchema } from "@/schemas";

export default function CreateQuizModal({ isOpen }: CreateQuizModalProps) {
  const [step, setStep] = useState(1);

  const initialValues: InitialValues = {
    title: "",
    description: "",
    category: "",
    duration: 30,
    difficulty: "Easy",
    totalMarks: 0,
    questions: [],
    currentQuestion: {
      text: "",
      type: "single",
      options: ["", ""],
      correctAnswer: [],
      marks: 5,
    },
  };

  const doSubmit = (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    console.log(values);
    setSubmitting(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Clean up on component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border border-gray-900 w-full max-w-4xl rounded-lg shadow-xl">
        <Formik
          initialValues={initialValues}
          onSubmit={doSubmit}
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
                  <QuestionForm />
                )}
              </div>

              {/* Footer */}
              <Footer
                step={step}
                setStep={setStep}
                isSubmitting={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
