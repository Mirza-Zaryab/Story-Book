import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin_token: "",
  role : ""
  
};

export const adminSlice = createSlice({
  name: 'book',
  initialState: { value: initialState },
  reducers: {
    login: (state, action) => {
      state.admin_token = action.payload.admin_token;
      state.role = action.payload.role;
    },
    logout: (state, action) => {
      state.admin_token = "";
      state.role = "";
      localStorage.removeItem("admin_token")
    },
    
  },
});
export const {
    login,
    logout
} = adminSlice.actions;
export default adminSlice.reducer;
