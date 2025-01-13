import React from "react";
import { cn } from "@/libs/utils";
import { Plus, Trash2 } from "lucide-react";
import { InitialValues } from "@/types/quizCreateModal";
import { Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import QuestionList from "./QuestionList";
import Button from "@/components/ui/Button";
import FieldContainer from "@/components/ui/FieldContainer";

export default function QuestionForm() {
  const { values, errors, touched, setFieldValue, setTouched } =
    useFormikContext<InitialValues>();
  const { questions, currentQuestion } = values;

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
    const updatedQuestions = [...questions, currentQuestion];
    setFieldValue("questions", updatedQuestions);
    setFieldValue("currentQuestion", {
      text: "",
      type: "single",
      options: ["", ""],
      correctAnswer: [],
      marks: 5,
    });

    // Reset the touched state for currentQuestion
    setTouched({
      currentQuestion: {
        text: false,
        type: false,
        //options: [false, false], // Adjust based on your options structure
        correctAnswer: false,
        marks: false,
      },
    });
  };

  // remove question handler for question list
  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setFieldValue("questions", updatedQuestions);
  };

  // edit question handler for question list
  const editQuestion = (index: number) => {
    const selectedQuestionToUpdate = questions.filter((_, i) => i === index);
    const updatedQuestions = questions.filter((_, i) => i !== index);

    setFieldValue("questions", updatedQuestions);

    setFieldValue("currentQuestion", {
      ...selectedQuestionToUpdate?.[0],
      isUpdate: true,
    });
  };

  return (
    <div>
      {/* Existing Questions List */}
      <QuestionList
        questions={questions}
        onRemoveQuestion={removeQuestion}
        onEditQuestion={editQuestion}
      />

      {/* Add New Question Form */}
      <div className="bg-[#343434] p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">
          Add New Question
        </h3>
        <div className="space-y-4">
          <FieldContainer label="Question Text" name="questionText">
            <Field
              as="textarea"
              id={`currentQuestion.text`}
              name={`currentQuestion.text`}
              className="w-full px-3 py-2 bg-background border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
              rows={2}
              placeholder="Enter your question"
            />
            <ErrorMessage
              name={`currentQuestion.text`}
              component="div"
              className="text-sm text-danger-light"
            />
          </FieldContainer>

          <div className="grid grid-cols-2 gap-4">
            {/* Question Type */}
            <FieldContainer label="Question Type" name="questionType">
              <Field name={`currentQuestion.type`}>
                {({ field }: { field: { value: string } }) => (
                  <div className="flex space-x-2">
                    {["single", "multiple" ].map((type) => (
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
            </FieldContainer>

            {/* Marks */}
            <FieldContainer label="Marks" name="marks">
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
                            : "bg-background border border-gray-700 text-white"
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
                        className="w-24 px-3 py-2 bg-background border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary"
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
            </FieldContainer>
          </div>

          {/* Question Option  */}
          <FieldContainer label="Options" name="options">
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
                                  : "bg-background border border-gray-700 text-white"
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
                              className="flex-1 px-3 py-2 bg-background border border-gray-700 rounded-md text-white focus:outline-none focus:border-green-500"
                              placeholder={`Option ${String.fromCharCode(
                                65 + index
                              )}`} // A, B, C, ...
                            />

                            {index > 1 && (
                              <button
                                type="button"
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
          </FieldContainer>
          <Button
            isDisabled={isAddQuestionDisabled}
            onHandler={addQuestionHandler}
            fullWidth={true}
          >
            {currentQuestion.isUpdate && "Update Question"}
            {!currentQuestion.isUpdate && (
              <>
                <Plus className="w-5 h-5 mr-1" />
                Add Question
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
