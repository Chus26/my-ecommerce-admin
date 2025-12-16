//Improt configureStore from redux toolkit
import { configureStore } from "@reduxjs/toolkit";

//Import auth slice reducer
import authSlice from "./auth";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

//export store
export default store;
