
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    api.get("/read/store/1")
      .then(res => setInventory(res.data || []));
  }, []);

  return (
    <Container>
      <Typography variant="h4">Inventory</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product ID</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map(i => (
            <TableRow key={i.product_id}>
              <TableCell>{i.product_id}</TableCell>
              <TableCell>{i.brand}</TableCell>
              <TableCell>{i.model}</TableCell>
              <TableCell>${i.price}</TableCell>
              <TableCell>{i.available_quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
