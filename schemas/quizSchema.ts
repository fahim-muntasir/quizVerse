import * as Yup from "yup";

export const quizCreationSchema = Yup.object({
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
  currentQuestion: Yup.object({
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
  }),
});