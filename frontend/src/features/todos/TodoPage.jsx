import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  readTodos,
  syncQueue,
  updateTodo,
  createTodo,
} from "./redux/todoSlice";
import { logout } from "../auth/redux/authSlice";
import TodoList from "./components/TodoList";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function TodoPage() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.todos.status);
  const error = useSelector((state) => state.todos.error);
  const user = useSelector((state) => state.auth.user);

  const [addOpen, setAddOpen] = useState(false);
  const [addText, setAddText] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ id: null, text: "" });

  const handleAddSubmit = () => {
    if (addText) {
      dispatch(createTodo(addText));
      setAddOpen(false);
      setAddText("");
    }
  };

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (currentTodo.text) {
      dispatch(updateTodo({ id: currentTodo.id, text: currentTodo.text }));
      setEditOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(readTodos());
    const debouncedHandleOnline = debounce(() => {
      dispatch(syncQueue()).then(() => dispatch(readTodos()));
    }, 3000); // 3s debounce
    window.addEventListener("online", debouncedHandleOnline);
    return () => window.removeEventListener("online", debouncedHandleOnline);
  }, [dispatch]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TODO List {navigator.onLine ? "(Online)" : "(Offline)"}
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Logged in as: {user?.username || "User"}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddOpen(true)}
          style={{ marginBottom: "20px" }}
        >
          Add TODO
        </Button>
        <TodoList onEdit={handleEdit} />
        {status === "failed" && <p>Error: {error}</p>}
      </div>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add TODO</DialogTitle>
        <DialogContent>
          <TextField
            label="New TODO"
            value={addText}
            onChange={(e) => setAddText(e.target.value)}
            fullWidth
          />
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Add
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit TODO</DialogTitle>
        <DialogContent>
          <TextField
            label="Edit Text"
            value={currentTodo.text}
            onChange={(e) =>
              setCurrentTodo({ ...currentTodo, text: e.target.value })
            }
            fullWidth
          />
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TodoPage;
