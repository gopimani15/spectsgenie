import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Box
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import JsBarcode from "jsbarcode";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("selectedStore"));
    const storeId = store?.store_id || 1;
    api.get(`/read/store/${storeId}`)
      .then(res => setInventory(res.data || []));
  }, []);

  const downloadBarcode = (product) => {
    if (!product.barcode) {
      alert("This product does not have a barcode assigned.");
      return;
    }

    // Create a temporary canvas for the label
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set dimensions for the label (roughly 2.5 x 1.5 inches at 96 DPI)
    canvas.width = 240;
    canvas.height = 140;

    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Barcode
    const barcodeCanvas = document.createElement("canvas");
    JsBarcode(barcodeCanvas, product.barcode, {
      format: "EAN13",
      width: 1.5,
      height: 60,
      displayValue: true,
      fontSize: 12,
      margin: 0
    });

    // Draw product info and barcode on main canvas
    ctx.fillStyle = "black";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${product.brand}`, canvas.width / 2, 20);
    ctx.font = "12px Arial";
    ctx.fillText(`${product.model}`, canvas.width / 2, 38);

    // Centering the barcode
    const barcodeX = (canvas.width - barcodeCanvas.width) / 2;
    ctx.drawImage(barcodeCanvas, barcodeX, 45);

    // Download logic
    const link = document.createElement("a");
    link.download = `barcode-${product.sku || product.product_id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Inventory Management</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your store inventory and print barcode labels.
      </Typography>

      <Table sx={{ bgcolor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" }}>
        <TableHead sx={{ bgcolor: "#f8f9fa" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Product ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map(item => (
            <TableRow key={item.product_id} hover>
              <TableCell>{item.product_id}</TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: "monospace", bgcolor: "#f1f3f5", px: 1, borderRadius: "4px", display: "inline-block" }}>
                  {item.sku || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>{item.barcode || <Typography color="text.disabled" variant="body2">No Barcode</Typography>}</TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell>
                <Box sx={{
                  bgcolor: item.available_quantity > 5 ? "#e6fffa" : "#fff5f5",
                  color: item.available_quantity > 5 ? "#00b894" : "#ff7675",
                  px: 1.5, py: 0.5, borderRadius: "12px", display: "inline-block", fontWeight: "600", fontSize: "0.8rem"
                }}>
                  {item.available_quantity}
                </Box>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Download Barcode Label">
                  <IconButton size="small" onClick={() => downloadBarcode(item)} color="primary">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {inventory.length === 0 && (
        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
          No products found in inventory.
        </Box>
      )}
    </Container>
  );
}
