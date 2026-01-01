
import React, { useState, useContext } from "react";
import { Button, TextField, Container, Typography } from "@mui/material";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    const res = await api.post("/auth/login", { username, password });
    const token = res.data.access_token;
    const role = JSON.parse(atob(token.split(".")[1])).role;
    login(token, role);
    window.location.href = "/dashboard";
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">SpectsGenie Login</Typography>
      <TextField fullWidth label="Username" margin="normal" onChange={e => setUsername(e.target.value)} />
      <TextField fullWidth type="password" label="Password" margin="normal" onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
    </Container>
  );
}
