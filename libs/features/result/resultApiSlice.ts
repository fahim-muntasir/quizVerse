import { apiSlice } from "../api/apiSlice";
import { CreateResultType } from "@/types/result";

export const resultApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createResult: builder.mutation<unknown, CreateResultType>({
      query: (body) => ({
        url: "/result",
        method: "POST",
        body: { ...body },
      })
    }),
  }),
});

export const { useCreateResultMutation } = resultApiSlice;
