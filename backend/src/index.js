import express from "express";
import cors from "cors";
import todoRoutes from "./features/todos/todoRoutes.js";
import userRoutes from "./features/users/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes);
app.use("/auth", userRoutes);

app.listen(3001, () => console.log("Backend server running on port 3001"));
