import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

let initialUser = null;
let initialToken = localStorage.getItem("token");
if (initialToken) {
  try {
    const decoded = jwtDecode(initialToken);
    if (decoded.exp * 1000 > Date.now()) {
      initialUser = decoded;
    } else {
      localStorage.removeItem("token");
      initialToken = null;
    }
  } catch (err) {
    localStorage.removeItem("token");
    initialToken = null;
  }
}

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, password }) => {
    const response = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }) => {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: initialUser, token: initialToken },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem("token");
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
