import { createSlice } from '@reduxjs/toolkit';

export const profileSlice = createSlice({
  name: 'profileSlice',
  initialState: {
    profileImg:"",
    firstN:"",
    lastN:"",
    username:""
  },
  reducers: {
    profileImg: (state, action) => {
      state.profileImg = action.payload.imgUrl;
      state.firstN = action.payload.firstN;
      state.lastN = action.payload.lastN;
    },
    username: (state, action) => {
      state.username=action.payload
    },
  },
});
export const { profileImg, username } = profileSlice.actions;
export default profileSlice.reducer;
