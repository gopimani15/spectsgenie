
import React, { useContext } from "react";
import { Button, Container, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container>
      <Typography variant="h4">Dashboard ({user?.role})</Typography>
      <Button href="/orders">Orders</Button>
      {user?.role === "ADMIN" && <Button href="/inventory">Inventory</Button>}
      <Button color="error" onClick={logout}>Logout</Button>
    </Container>
  );
}
