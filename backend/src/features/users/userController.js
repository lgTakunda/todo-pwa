import { register, findByUsername } from "./userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = (req, res) => {
  const { username, password } = req.body;
  findByUsername(username, (err, user) => {
    if (user) return res.status(400).json({ msg: "User already exists" });
    register(username, password, (err, newUser) => {
      if (err) return res.status(500).json({ error: err.message });
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        "secret",
        { expiresIn: "7d" }
      ); // 7 days for dev
      res.json({ token });
    });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;
  findByUsername(username, (err, user) => {
    if (err || !user)
      return res.status(400).json({ msg: "Invalid credentials" });
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch)
        return res.status(400).json({ msg: "Invalid credentials" });
      const token = jwt.sign(
        { id: user.id, username: user.username },
        "secret",
        { expiresIn: "24h" }
      ); // Extended for dev
      res.json({ token });
    });
  });
};
