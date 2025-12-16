//Import from @redux toolkit
import { createSlice } from "@reduxjs/toolkit";

//Initialize auth state
const initialAuthState = {
  isAuthenticated: false,
  userName: "",
  userRole: "",
  token: null,
};

//Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    //Set auth
    setAuth(state, action) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
    },
    //Set on logout
    onLogout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userName = "";
      state.userRole = "";
    },
  },
});

//export auth actions
export const authActions = authSlice.actions;

//export default auth slice reducer
export default authSlice.reducer;
