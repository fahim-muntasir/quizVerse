import { apiSlice } from "../api/apiSlice";

const generateQuery = (params: Record<string, number | string>) => {
  let queryString = "";
  for (const key in params) {
    queryString += `${key}=${params[key]}&`;
  }

  return queryString;
};

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useGetUserQuizzesQuery } = userApiSlice;
