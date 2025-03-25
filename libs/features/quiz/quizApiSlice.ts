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
    getQuizzes: builder.query<
      unknown,
      {
        page?: number;
        limit?: number;
        searchQuery?: string;
        category?: string;
        difficulty?: string;
        duration?: string;
      }
    >({
      query: ({ page, limit, searchQuery, category, difficulty, duration }) => {
        return `/quizzes?${generateQuery({
          page: page ?? 1,
          limit: limit ?? 10,
          search: searchQuery ?? "",
          category: category ?? "",
          difficulty: difficulty ?? "",
          duration: duration ?? 1,
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

    deleteQuiz: builder.mutation<unknown, { id: string; userId: string }>({
      query: ({ id }) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserQuizzes"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useCreateQuizMutation,
  useDeleteQuizMutation,
} = quizApiSlice;
