import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTodo } from "../redux/todoSlice";
import { TextField, Button } from "@mui/material";

function TodoForm() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
      dispatch(createTodo(text));
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <TextField
        label="New TODO"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        style={{ marginTop: "10px" }}
      >
        Add TODO
      </Button>
    </form>
  );
}

export default TodoForm;
