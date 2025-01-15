import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/libs/features/modal/modalSlice";
import participantQuizReducer from "@/libs/features/participantQuiz/participantQuizSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      participantQuiz: participantQuizReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
