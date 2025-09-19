import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import db from "../../../config/db";
import { logout } from "../../auth/redux/authSlice";

const getToken = () => localStorage.getItem("token");

const isOnline = () => navigator.onLine;

const normalizeTodo = (todo) => ({ ...todo });

export const syncQueue = createAsyncThunk(
  "todos/syncQueue",
  async (_, { dispatch }) => {
    const token = getToken();
    if (!token) {
      dispatch(logout());
      return;
    }
    const queue = await db.queue.toArray();
    for (const item of queue) {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        if (item.action === "add") {
          const response = await fetch("/todos", {
            method: "POST",
            headers,
            body: JSON.stringify(item.payload),
          });
          if (!response.ok)
            throw new Error(`Add failed with status ${response.status}`);
          const serverTodo = await response.json();
          if (item.tempId) {
            await db.todos.delete(item.tempId);
          }
          await db.todos.put(normalizeTodo(serverTodo));
          await db.queue.delete(item.id);
        } else if (item.action === "updateOne") {
          const response = await fetch(`/todos/${item.payload.id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(item.payload),
          });
          if (!response.ok)
            throw new Error(`Update failed with status ${response.status}`);
          await db.queue.delete(item.id);
        } else if (item.action === "delete") {
          const response = await fetch(`/todos/${item.payload.id}`, {
            method: "DELETE",
            headers,
          });
          if (!response.ok)
            throw new Error(`Delete failed with status ${response.status}`);
          await db.queue.delete(item.id);
        }
      } catch (error) {
        if (error.message.includes("401")) {
          dispatch(logout());
        }
        // Silent log to reduce spam
        console.log("Sync failed for", item, error.message);
      }
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (text, { getState }) => {
    const state = getState();
    const username = state.auth.user?.username || "Unknown";
    const tempId = Date.now();
    const todo = { id: tempId, text, username };
    await db.todos.put(todo);
    if (isOnline()) {
      try {
        const response = await fetch("/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("Add failed");
        const serverTodo = await response.json();
        await db.todos.delete(tempId);
        await db.todos.put(normalizeTodo(serverTodo));
        return normalizeTodo(serverTodo);
      } catch (error) {
        console.error("Add todo failed:", error);
        await db.queue.add({ action: "add", payload: { text }, tempId });
        return todo;
      }
    } else {
      await db.queue.add({ action: "add", payload: { text }, tempId });
      return todo;
    }
  }
);

export const readTodos = createAsyncThunk(
  "todos/readTodos",
  async (_, { dispatch }) => {
    const token = getToken();
    if (!token) {
      dispatch(logout());
      return [];
    }
    const localTodos = await db.todos.toArray();
    if (!isOnline()) return localTodos.map(normalizeTodo);
    try {
      const response = await fetch("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 401) dispatch(logout());
        throw new Error("Fetch failed");
      }
      const serverTodos = await response.json();
      await db.todos.clear();
      await db.todos.bulkPut(serverTodos.map(normalizeTodo));
      return serverTodos.map(normalizeTodo);
    } catch (error) {
      console.log("Fetch todos failed:", error.message);
      return localTodos.map(normalizeTodo);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, text }) => {
    const updates = { id, text };
    await db.todos.updateOne(id, updates);
    if (isOnline()) {
      try {
        await fetch(`/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(updates),
        });
      } catch (error) {
        console.error("Update todo failed:", error);
        await db.queue.add({ action: "updateOne", payload: updates });
      }
    } else {
      await db.queue.add({ action: "updateOne", payload: updates });
    }
    return updates;
  }
);

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
  await db.todos.delete(id);
  if (isOnline()) {
    try {
      await fetch(`/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
    } catch (error) {
      console.error("Delete todo failed:", error);
      await db.queue.add({ action: "delete", payload: { id } });
    }
  } else {
    await db.queue.add({ action: "delete", payload: { id } });
  }
  return id;
});

const todoSlice = createSlice({
  name: "todos",
  initialState: { list: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTodo.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(readTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(readTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.list.findIndex((t) => t.id === action.payload.id);
        if (index !== -1)
          state.list[index] = { ...state.list[index], ...action.payload };
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
      })
      .addCase(syncQueue.fulfilled, (state) => {});
  },
});

export default todoSlice.reducer;
