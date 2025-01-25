import { apiSlice } from "../api/apiSlice";

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
        return `/quizzes?${generateQuery({ page: page ?? 1, limit: limit ?? 10 })}`;
      },
    }),
  }),
});

export const { useGetQuizzesQuery } = quizApiSlice;
