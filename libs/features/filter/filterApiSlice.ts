import { apiSlice } from "../api/apiSlice";

const generateQuery = (params: Record<string, number | string>) => {
  let queryString = "";
  for (const key in params) {
    queryString += `${key}=${params[key]}&`;
  }

  return queryString;
};

export const filterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchHandler: builder.query<
      unknown,
      { page?: number; limit?: number; searchQuery?: string }
    >({
      query: ({ page, limit, searchQuery }) => {
        return `/search/quizzes?${generateQuery({
          page: page ?? 1,
          limit: limit ?? 10,
          search: searchQuery ?? "",
        })}`;
      },
    }),
  }),
});

export const { useSearchHandlerQuery } = filterApiSlice;
