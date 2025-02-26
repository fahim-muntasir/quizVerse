import { apiSlice } from "../api/apiSlice";
import { CreateResultType } from "@/types/result";

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
      invalidatesTags: (result, error, res) => {
        const quizId = res.quizId;
        return [
          { type: "Quiz" },
          { type: "CheckParticipants", id: quizId },
        ]
      },
    }),
  }),
});

export const { useCreateResultMutation, useGetResultByQuizIdQuery } =
  resultApiSlice;
