import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./features/todos/redux/todoSlice";
import authReducer from "./features/auth/redux/authSlice"; // New

const store = configureStore({
  reducer: {
    todos: todoReducer,
    auth: authReducer,
  },
});

export default store;
