import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "./redux/authSlice";
import { TextField, Button, Typography, Box } from "@mui/material";

function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      dispatch(register({ username, password }));
    } else {
      dispatch(login({ username, password }));
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" padding="20px">
      <Typography variant="h5">{isRegister ? "Register" : "Login"}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isRegister ? "Register" : "Login"}
        </Button>
      </form>
      <Button onClick={() => setIsRegister(!isRegister)} color="secondary">
        {isRegister ? "Switch to Login" : "Switch to Register"}
      </Button>
    </Box>
  );
}

export default AuthForm;
