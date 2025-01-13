import { configureStore } from "@reduxjs/toolkit";
import createQuizReducer from "@/libs/features/createQuiz/createQuizSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      createQuiz: createQuizReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
