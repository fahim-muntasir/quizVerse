import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "@/types/quiz";

type initialStateType = {
  allQuizzes: Quiz[];
  userQuizzes: Quiz[];
};

export const initialState: initialStateType = {
  allQuizzes: [],
  userQuizzes: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setAllQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.allQuizzes = action.payload;
    },
    setUserQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.userQuizzes = action.payload;
    },
    updateQuizParticipation: (state, action: PayloadAction<{ quizId: string; totalParticipants: number }>) => {
      const { quizId, totalParticipants } = action.payload;
      const index = state.allQuizzes.findIndex((quiz) => quiz._id === quizId);
      if (index !== -1) {
        state.allQuizzes[index].isParticipated = true;
        state.allQuizzes[index].totalParticipants = totalParticipants;
      }
    },
    updateUserQuizParticipation: (state, action: PayloadAction<{ quizId: string; totalParticipants: number }>) => {
      const { quizId, totalParticipants } = action.payload;
      const index = state.userQuizzes.findIndex((quiz) => quiz._id === quizId);
      if (index !== -1) {
        state.userQuizzes[index].isParticipated = true;
        state.userQuizzes[index].totalParticipants = totalParticipants;
      }
    },
  },
});

export default quizSlice.reducer;
export const {
  setAllQuizzes,
  updateQuizParticipation,
  setUserQuizzes,
  updateUserQuizParticipation,
} = quizSlice.actions;
