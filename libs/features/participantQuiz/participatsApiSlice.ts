import { apiSlice } from "../api/apiSlice";

export const participantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkParticipats: builder.query<unknown, string>({
      query: (quizId) => {
        return `/${quizId}/checkParticipates`;
      },
      providesTags: (result, error, quizId) => [{ type: "CheckParticipants", id: quizId }]
    }),
  }),
});

export const { useCheckParticipatsQuery } = participantApiSlice;
