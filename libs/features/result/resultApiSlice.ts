import { apiSlice } from "../api/apiSlice";
import { CreateResultType } from "@/types/result";
import { quizApiSlice } from "../quiz/quizApiSlice";
import {
  updateQuizParticipation,
  updateUserQuizParticipation,
} from "../quiz/quizSlice";

export const resultApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResultByQuizId: builder.query<unknown, string>({
      query: (quizId) => `/${quizId}/result`,
    }),
    createResult: builder.mutation<unknown, CreateResultType>({
      query: (body) => ({
        url: "/result",
        method: "POST",
        body: { ...body },
      }),
      // invalidatesTags: ["Quizzes", "UserQuizzes"],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: createdResult } = await queryFulfilled;

          const state: any = getState();

          const quizzesQueries = quizApiSlice.util.selectInvalidatedBy(state, [
            "Quizzes",
          ]);
          const userQuizzesQueries = quizApiSlice.util.selectInvalidatedBy(
            state,
            ["UserQuizzes"]
          );

          let updatedTotalParticipants: number | undefined;

          // ✅ Update getQuizzes cache
          quizzesQueries.forEach(({ originalArgs }) => {
            dispatch(
              quizApiSlice.util.updateQueryData(
                "getQuizzes",
                originalArgs,
                (draft: any) => {
                  const quiz = draft?.data?.find(
                    (q: any) => q._id === createdResult?.data?.quiz
                  );
                  if (quiz) {
                    quiz.isParticipated = true;
                    quiz.totalParticipants = (quiz.totalParticipants || 0) + 1;

                    updatedTotalParticipants = quiz.totalParticipants;
                  }
                }
              )
            );
          });

          // ✅ Update getUserQuizzes cache
          userQuizzesQueries.forEach(({ originalArgs }) => {
            dispatch(
              quizApiSlice.util.updateQueryData(
                "getUserQuizzes",
                originalArgs,
                (draft: any) => {
                  const quiz = draft?.data?.find(
                    (q: any) => q._id === createdResult?.data?.quiz
                  );
                  if (quiz) {
                    quiz.isParticipated = true;
                    quiz.totalParticipants = (quiz.totalParticipants || 0) + 1;

                    updatedTotalParticipants = quiz.totalParticipants;
                  }
                }
              )
            );
          });

          // ✅ Update Redux state with the updated participant count
          dispatch(
            updateQuizParticipation({
              quizId: createdResult?.data?.quiz,
              totalParticipants: updatedTotalParticipants || 0,
            })
          );

          dispatch(
            updateUserQuizParticipation({
              quizId: createdResult?.data?.quiz,
              totalParticipants: updatedTotalParticipants || 0,
            })
          );
        } catch (error) {
          console.error("Error updating getQuizzes cache:", error);
        }
      },
    }),
  }),
});

export const { useCreateResultMutation, useGetResultByQuizIdQuery } =
  resultApiSlice;
