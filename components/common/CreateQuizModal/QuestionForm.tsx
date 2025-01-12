import React from "react";
import { cn } from "@/libs/utils";
import { Plus, Trash2 } from "lucide-react";
import { InitialValues } from "@/types/quizCreateModal";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import QuestionList from "./QuestionList";

export default function QuestionForm() {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<InitialValues>();

  const requiredFieldsToAddQuestions = [
    "text",
    "type",
    "options",
    "correctAnswer",
    "marks",
  ];

  // Check if all required fields in currentQuestion are valid
  const areFieldsValid = () =>
    requiredFieldsToAddQuestions.every((field) => {
      const value =
        values.currentQuestion[field as keyof InitialValues["currentQuestion"]];
      const error =
        errors.currentQuestion?.[
          field as keyof InitialValues["currentQuestion"]
        ];
      const isTouched =
        touched.currentQuestion?.[
          field as keyof InitialValues["currentQuestion"]
        ];

      return !error && (isTouched || value);
    });

  // Example usage to disable the button
  const isAddQuestionDisabled = !areFieldsValid();

  const addQuestionHandler = () => {
    const updatedQuestions = [...values.questions, values.currentQuestion];
    setFieldValue("questions", updatedQuestions);
    setFieldValue("currentQuestion", {
      text: "",
      type: "multiple",
      options: ["", ""],
      correctAnswer: [],
      marks: 1,
    });
  };

  return (
    <div>
      {/* Existing Questions List */}
      <QuestionList />

      {/* Add New Question Form */}
      <div className="bg-[#343434] p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">
          Add New Question
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Question Text
            </label>
            <Field
              as="textarea"
              id={`currentQuestion.text`}
              name={`currentQuestion.text`}
              className="w-full px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
              rows={2}
              placeholder="Enter your question"
            />
            <ErrorMessage
              name={`currentQuestion.text`}
              component="div"
              className="text-sm text-danger-light"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Question Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Question Type
              </label>
              <Field name={`currentQuestion.type`}>
                {({ field }: { field: { value: string } }) => (
                  <div className="flex space-x-2">
                    {["multiple", "single"].map((type) => (
                      <label
                        key={type}
                        className={cn(
                          "px-4 py-2 rounded-md border transition-all duration-300 cursor-pointer",
                          field.value === type
                            ? {
                                multiple:
                                  "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                single:
                                  "bg-purple-500/10 text-purple-500 border-purple-500/20",
                              }[type]
                            : "bg-[#343434] border border-gray-700 text-white"
                        )}
                      >
                        <input
                          type="radio"
                          {...field}
                          value={type}
                          className="hidden"
                        />
                        {type === "multiple"
                          ? "Multiple Choice"
                          : "Single Choice"}
                      </label>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            {/* Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marks
              </label>
              <Field name={`currentQuestion.marks`}>
                {({ field }: { field: { value: number } }) => (
                  <div className="flex space-x-2">
                    {[5, 10, 15].map((mark) => (
                      <label
                        key={mark}
                        className={cn(
                          "w-20 px-4 py-2 rounded-md border transition-all duration-300 text-center cursor-pointer",
                          field.value == mark
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-[#1C1C1C] border border-gray-700 text-white"
                        )}
                      >
                        <input
                          type="radio"
                          {...field}
                          value={mark}
                          className="hidden"
                        />
                        {mark}
                      </label>
                    ))}
                    {/* Custom Input */}
                    <div className="relative">
                      <Field
                        type="number"
                        className="w-24 px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary"
                        placeholder="..."
                        name={`currentQuestion.marks`}
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </Field>

              <ErrorMessage
                name={`currentQuestion.marks`}
                component="div"
                className="text-sm text-danger-light"
              />
            </div>
          </div>

          {/* Question Option  */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Options
            </label>
            <div className="space-y-2">
              <FieldArray name={`currentQuestion.options`}>
                {({ push, remove, form }) => (
                  <div>
                    {form.values.currentQuestion.options?.map(
                      (option: string, index: number) => (
                        <div key={index} className="mb-2">
                          <div className="flex gap-2 items-center">
                            <button
                              type="button"
                              className={cn(
                                "w-10 h-10 rounded-md flex items-center justify-center border transition-all duration-300",
                                form.values.currentQuestion.correctAnswer.includes(
                                  index.toString()
                                )
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-[#1C1C1C] border border-gray-700 text-white"
                              )}
                              onClick={() => {
                                const correctAnswer = form.values
                                  .currentQuestion.correctAnswer as string[];
                                if (
                                  form.values.currentQuestion.type ===
                                  "multiple"
                                ) {
                                  if (
                                    correctAnswer.includes(index.toString())
                                  ) {
                                    form.setFieldValue(
                                      `currentQuestion.correctAnswer`,
                                      correctAnswer.filter(
                                        (item) => item !== index.toString()
                                      )
                                    );
                                  } else {
                                    form.setFieldValue(
                                      `currentQuestion.correctAnswer`,
                                      [...correctAnswer, index.toString()]
                                    );
                                  }
                                } else {
                                  form.setFieldValue(
                                    `currentQuestion.correctAnswer`,
                                    [index.toString()]
                                  );
                                }
                              }}
                            >
                              {String.fromCharCode(65 + index)}{" "}
                              {/* A, B, C, ... */}
                            </button>

                            <Field
                              type="text"
                              name={`currentQuestion.options[${index}]`}
                              className="flex-1 px-3 py-2 bg-[#1C1C1C] border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                              placeholder={`Option ${String.fromCharCode(
                                65 + index
                              )}`} // A, B, C, ...
                            />

                            {index > 1 && (
                              <button
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-400 p-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <ErrorMessage
                            name={`currentQuestion.options[${index}]`}
                            component="div"
                            className="text-sm text-danger-light"
                          />
                        </div>
                      )
                    )}

                    {form.values.currentQuestion.options &&
                      form.values.currentQuestion.options.length < 4 && (
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="mt-2 text-green-500 hover:text-green-400 text-sm flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </button>
                      )}
                  </div>
                )}
              </FieldArray>
            </div>
          </div>

          <button
            type="button"
            disabled={isAddQuestionDisabled}
            onClick={addQuestionHandler}
            className="w-full flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
