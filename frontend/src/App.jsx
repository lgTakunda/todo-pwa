import React from "react";
import { useSelector } from "react-redux";
import TodoPage from "./features/todos/TodoPage";
import AuthForm from "./features/auth/AuthForm";

function App() {
  const user = useSelector((state) => state.auth.user);

  return <div>{user ? <TodoPage /> : <AuthForm />}</div>;
}

export default App;
