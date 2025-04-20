import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  createQuizModal: { isOpen: false },
  participateQuizModal: { isOpen: false },
  createRoomModal: { isOpen: false },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openCreateQuizModal: (state) => {
      state.createQuizModal.isOpen = true;
    },
    closeCreateQuizModal: (state) => {
      state.createQuizModal.isOpen = false;
    },
    openParticipateQuizModal: (state) => {
      state.participateQuizModal.isOpen = true;
    },
    closeParticipateQuizModal: (state) => {
      state.participateQuizModal.isOpen = false;
    },
    openCreateRoomModal: (state) => {
      state.createRoomModal.isOpen = true;
    },
    closeCreateRoomModal: (state) => {
      state.createRoomModal.isOpen = false;
    },
  },
});

export default modalSlice.reducer;
export const {
  openCreateQuizModal,
  closeCreateQuizModal,
  openParticipateQuizModal,
  closeParticipateQuizModal,
  openCreateRoomModal,
  closeCreateRoomModal,
} = modalSlice.actions;
