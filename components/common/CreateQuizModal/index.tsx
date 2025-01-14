"use client";
import React, { useState } from "react";
import Modal from "../Modal";
import ProgressBar from "./ProgressBar";
import Footer from "./Footer";
import { CreateQuizModalProps } from "@/types/quizCreateModal";
import QuizDetailsForm from "./QuizDetailsForm";
import QuestionForm from "./QuestionForm";
import { Formik, Form, FormikHelpers } from "formik";
import { InitialValues } from "@/types/quizCreateModal";
import { quizCreationSchema } from "@/schemas";
import { useAppDispatch } from "@/libs/hooks";
import { close } from "@/libs/features/createQuiz/createQuizSlice";

export default function CreateQuizModal({ isOpen }: CreateQuizModalProps) {
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();

  const onCloseHandler = () => {
    dispatch(close());
  };

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

  if (!isOpen) return null;

  return (
    <Modal onClose={onCloseHandler} title="Create New Quiz">
      <Formik
        initialValues={initialValues}
        onSubmit={doSubmit}
        validationSchema={quizCreationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
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
            <Footer step={step} setStep={setStep} isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
