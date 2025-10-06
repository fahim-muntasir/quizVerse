import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "@/libs/features/modal/modalSlice";
import participantQuizReducer from "@/libs/features/participantQuiz/participantQuizSlice";
import quizReducer from "@/libs/features/quiz/quizSlice";
import authSliceReducer from "@/libs/features/auth/authSlice";
import roomReducer from "@/libs/features/room/roomSlice";
import filterSliceReducer from "@/libs/features/filter/filterSlice";
import { apiSlice } from "./features/api/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalReducer,
      participantQuiz: participantQuizReducer,
      auth: authSliceReducer,
      filter: filterSliceReducer,
      quiz: quizReducer,
      room: roomReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(apiSlice.middleware);
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
