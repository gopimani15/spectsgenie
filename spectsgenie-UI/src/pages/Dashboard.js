
import React, { useContext } from "react";
import { Button, Container, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container>
      <Typography variant="h4">Dashboard ({user?.role})</Typography>
      <Button href="/orders">Orders</Button>
      <Button href="/inventory">Inventory</Button>
      <Button href="/product-management">Products</Button>
      <Button color="error" onClick={logout}>Logout</Button>
    </Container>
  );
}
