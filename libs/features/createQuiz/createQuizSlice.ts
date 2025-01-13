import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const createQuizSlice = createSlice({
  name: "createQuiz",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
    initialValue: (state, actions: PayloadAction<boolean>) => {
      state.isOpen = actions.payload;
    },
  },
});

export default createQuizSlice.reducer;
export const { open, close, initialValue } = createQuizSlice.actions;
