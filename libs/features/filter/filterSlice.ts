import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const initialState: { searchQuery: string } = {
  searchQuery: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    search: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export default filterSlice.reducer;
export const { search } = filterSlice.actions;
