import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<unknown, { fullName: string; email: string; password: string }>({
      query: ({ fullName, email, password }) => ({
        url: "/auth/signup",
        method: "POST",
        body: { fullName, email, password },
      }),
    }),

    signIn: builder.mutation<unknown, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/auth/signin",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation } = authApiSlice;
