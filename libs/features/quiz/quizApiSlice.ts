import { apiSlice } from "../api/apiSlice";
import { CreateQuizType } from "@/types/quizCreateModal";

const generateQuery = (params: Record<string, number | string>) => {
  let queryString = "";
  for (const key in params) {
    queryString += `${key}=${params[key]}&`;
  }

  return queryString;
};

export const quizApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<unknown, { page?: number; limit?: number }>({
      query: ({ page, limit }) => {
        return `/quizzes?${generateQuery({
          page: page ?? 1,
          limit: limit ?? 10,
        })}`;
      },
      providesTags: ["Quiz"],
    }),
    createQuiz: builder.mutation<unknown, CreateQuizType>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const { useGetQuizzesQuery, useCreateQuizMutation } = quizApiSlice;
