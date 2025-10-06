import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SpeakingUsersState {
  [userId: string]: boolean;
}

interface RoomState {
  isAudioEnabled: boolean;
  isMuted: boolean;
  speakingUsers: SpeakingUsersState;
}

const initialState: RoomState = {
  isAudioEnabled: false,
  isMuted: false,
  speakingUsers: {},
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setAudioEnabled: (state, action: PayloadAction<boolean>) => {
      state.isAudioEnabled = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
    setSpeakingUser: (state, action: PayloadAction<string>) => {
      state.speakingUsers[action.payload] = true;
    },
    removeSpeakingUser: (state, action: PayloadAction<string>) => {
      delete state.speakingUsers[action.payload];
    },
    clearSpeakingUsers: (state) => {
      state.speakingUsers = {};
    }
  },
});

export const {
  setAudioEnabled,
  setMuted,
  setSpeakingUser,
  removeSpeakingUser,
  clearSpeakingUsers,
} = roomSlice.actions;

export default roomSlice.reducer;
