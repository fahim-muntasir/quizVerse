import { apiSlice } from "../api/apiSlice";

export const leaderboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTopParticipants: builder.query<unknown, void>({
      query: () => {
        return `/topparticipants`;
      },
      providesTags: ["TopParticipants"],
    }),
  }),
});

export const { useGetTopParticipantsQuery } = leaderboardApiSlice;
