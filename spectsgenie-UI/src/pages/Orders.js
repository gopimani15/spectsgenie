
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Container, Typography, List, ListItem } from "@mui/material";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders")
      .then(res => setOrders(res.data || []));
  }, []);

  return (
    <Container>
      <Typography variant="h4">Orders</Typography>
      <List>
        {orders.map(o => (
          <ListItem key={o.order_id}>
            Order #{o.order_id} - {o.order_status}
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
