import express from "express";
import {
  readTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todoController.js";
import authMiddleware from "../../middleware/auth.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", readTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
