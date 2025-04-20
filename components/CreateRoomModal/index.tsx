"use client";
import React from "react";
import Modal from "../common/Modal";
import Header from "../common/Modal/Header";
import { CreateQuizModalProps } from "@/types/quizCreateModal";
import { Formik, Form, FormikHelpers } from "formik";
import { Users } from "lucide-react";
import { InitialValues } from "@/types/quizCreateModal";
import { quizCreationSchema } from "@/schemas";
import { useAppDispatch } from "@/libs/hooks";
import { closeCreateRoomModal } from "@/libs/features/modal/modalSlice";
import { useCreateQuizMutation } from "@/libs/features/quiz/quizApiSlice";
import { toast } from "react-hot-toast";
import { Field, ErrorMessage } from "formik";
import FieldContainer from "../ui/FieldContainer";
import Button from "@/components/ui/Button";

export default function CreateRoomModal({ isOpen }: CreateQuizModalProps) {
  const [createQuiz] = useCreateQuizMutation();
  const dispatch = useAppDispatch();

  const onCloseHandler = () => {
    dispatch(closeCreateRoomModal());
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

  const doSubmit = async (
    values: InitialValues,
    { setSubmitting }: FormikHelpers<InitialValues>
  ) => {
    try {
      const requestBody = {
        title: values.title,
        description: values.description,
        category: values.category,
        difficulty: values.difficulty,
        duration: values.duration,
        questions: values.questions,
        totalMarks: values.totalMarks,
      }

      await createQuiz(requestBody).unwrap();

      onCloseHandler();
      toast.success("Quiz created successfully!");
      setSubmitting(false);
    } catch (error) {
      console.error("Quiz creation failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <Header onClose={onCloseHandler} title="Create Language Practice Room" />
      <Formik
        initialValues={initialValues}
        onSubmit={doSubmit}
        validationSchema={quizCreationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="p-6 space-y-4">
              <FieldContainer label="Quiz Title" name="quizTitle">
                <Field
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  placeholder="e.g., English Conversation Practice"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-sm text-danger-light"
                />
              </FieldContainer>

              <FieldContainer label="Description" name="description">
                <Field
                  name="description"
                  as="textarea"
                  className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  rows={3}
                  placeholder="Describe what participants can expect in this room..."
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-sm text-danger-light"
                />
              </FieldContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FieldContainer label="Language" name="language">
                  <Field
                    name="language"
                    as="select"
                    className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  >
                    {['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese'].map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="language"
                    component="div"
                    className="text-sm text-danger-light"
                  />
                </FieldContainer>

                <FieldContainer label="Proficiency Level" name="level">
                  <Field
                    name="level"
                    as="select"
                    className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                  >
                    {['Beginner', 'Intermediate', 'Advanced', 'Native'].map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="level"
                    component="div"
                    className="text-sm text-danger-light"
                  />
                </FieldContainer>

                <FieldContainer label="Maximum Participants" name="maxParticipants">
                  <div className="relative">
                    <Field
                      type="number"
                      name="maxParticipants"
                      className="w-full px-3 py-2 bg-[#343434] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500 pl-9"
                      min={2}
                      max={12}
                    />
                    <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  </div>
                  <ErrorMessage
                    name="maxParticipants"
                    component="div"
                    className="text-sm text-danger-light"
                  />
                </FieldContainer>
              </div>
            </div>

            <div className="border-t border-gray-800 p-4 flex justify-between">
              <div className="flex justify-end w-full">
                <Button isDisabled={isSubmitting}>
                  Create Room
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
