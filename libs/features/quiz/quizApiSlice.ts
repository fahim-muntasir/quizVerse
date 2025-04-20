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
      providesTags: ["Quizzes"],
    }),

    createQuiz: builder.mutation<unknown, CreateQuizType>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body: { ...body },
      }),
      invalidatesTags: ["Quizzes"],
    }),

    getUserQuizzes: builder.query<
      unknown,
      {
        page?: number;
        limit?: number;
        searchQuery?: string;
        category?: string;
        difficulty?: string;
        duration?: string;
        userId?: string;
      }
    >({
      query: ({ page, limit, searchQuery, category, difficulty, duration, userId }) => {
        return `/users/quizzes/${userId}?${generateQuery({
          page: page ?? 1,
          limit: limit ?? 10,
          search: searchQuery ?? "",
          category: category ?? "",
          difficulty: difficulty ?? "",
          duration: duration ?? 1,
        })}`;
      },
      providesTags: ["UserQuizzes"],
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
  useGetUserQuizzesQuery,
} = quizApiSlice;
