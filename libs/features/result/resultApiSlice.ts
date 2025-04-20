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
      invalidatesTags: ["Quizzes", "UserQuizzes"],
    }),
  }),
});

export const { useCreateResultMutation, useGetResultByQuizIdQuery } =
  resultApiSlice;
