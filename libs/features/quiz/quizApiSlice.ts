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
    getQuizzes: builder.query<unknown, { page?: number; limit?: number; searchQuery?: string }>({
      query: ({ page, limit, searchQuery }) => {
        return `/quizzes?${generateQuery({
          page: page ?? 1,
          limit: limit ?? 10,
          search: searchQuery ?? "",
        })}`;
      },
      providesTags: (result, error, { page }) => [{ type: "Quiz", id: page }],
    }),
    createQuiz: builder.mutation<unknown, CreateQuizType>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: [{ type: "Quiz" }, { type: "CheckParticipants" }],
    }),
  }),
});

export const { useGetQuizzesQuery, useCreateQuizMutation } = quizApiSlice;
