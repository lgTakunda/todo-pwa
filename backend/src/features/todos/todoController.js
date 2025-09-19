import { createOne, readAll, updateOne, deleteOne } from "./todoModel.js";

export const createTodo = (req, res) => {
  createOne(req.body.text, req.user.id, (err, todo) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(todo);
  });
};

export const readTodos = (req, res) => {
  readAll(req.user.id, (err, todos) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(todos);
  });
};

export const updateTodo = (req, res) => {
  const id = parseInt(req.params.id);
  updateOne(id, req.body.text, req.user.id, (err, todo) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!todo) return res.status(404).send();
    res.json(todo);
  });
};

export const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);
  deleteOne(id, req.user.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.send();
  });
};
