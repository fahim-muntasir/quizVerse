import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "@/types/quiz";

type initialStateType = {
  selectedQuiz: Quiz | null;
}

export const initialState: initialStateType = {
  selectedQuiz: null,
};

const participantQuizSlice = createSlice({
  name: "participantQuiz",
  initialState,
  reducers: {
    onSelectQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.selectedQuiz = action.payload;
    },
  },
});

export default participantQuizSlice.reducer;
export const { onSelectQuiz } = participantQuizSlice.actions;
