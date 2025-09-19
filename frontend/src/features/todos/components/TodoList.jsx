import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTodo } from "../redux/todoSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function TodoList({ onEdit }) {
  const todos = useSelector((state) => state.todos.list);
  const dispatch = useDispatch();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>TODO Text</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>{todo.text}</TableCell>
              <TableCell>{todo.username}</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(todo)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => dispatch(deleteTodo(todo.id))}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TodoList;
