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
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    Snackbar,
    InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [formData, setFormData] = useState({
        brand: "",
        model: "",
        product_type: "FRAME",
        price: "",
        sku: "",
        barcode: "",
        available_quantity: 0
    });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const store = JSON.parse(localStorage.getItem("selectedStore"));
            const storeId = store?.store_id || 1;

            if (searchTerm.length > 2) {
                api.get(`/read/search?q=${encodeURIComponent(searchTerm)}&store_id=${storeId}`)
                    .then(res => setProducts(res.data || []))
                    .catch(err => console.error("Search failed", err));
            } else {
                fetchProducts(storeId);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchProducts = (storeId) => {
        let sid = storeId;
        if (!sid) {
            const store = JSON.parse(localStorage.getItem("selectedStore"));
            sid = store?.store_id || 1;
        }
        api.get(`/read/store/${sid}`)
            .then(res => setProducts(res.data || []))
            .catch(err => {
                console.error("Fetch products failed:", err);
                showNotification("Failed to fetch products", "error");
            });
    };

    const showNotification = (message, severity = "success") => {
        setNotification({ open: true, message, severity });
    };

    const handleOpen = (product = null) => {
        if (product) {
            setEditProduct(product);
            setFormData({
                brand: product.brand,
                model: product.model,
                product_type: product.product_type || "FRAME",
                price: product.price || product.base_price || "",
                sku: product.sku || "",
                barcode: product.barcode || "",
                available_quantity: product.available_quantity || 0
            });
        } else {
            setEditProduct(null);
            setFormData({
                brand: "",
                model: "",
                product_type: "FRAME",
                price: "",
                sku: "",
                barcode: "",
                available_quantity: 0
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sid = JSON.parse(localStorage.getItem("selectedStore"))?.store_id || 1;
        const data = {
            ...formData,
            store_id: sid
        };

        const request = editProduct
            ? api.put(`/catalog/products/${editProduct.product_id}`, data)
            : api.post("/catalog/products", data);

        request
            .then(() => {
                showNotification(editProduct ? "Product updated successfully" : "Product created successfully");
                handleClose();
                fetchProducts();
            })
            .catch(err => {
                console.error(err);
                showNotification("Operation failed", "error");
            });
    };

    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to deactivate this product?")) {
            api.delete(`/catalog/products/${productId}`)
                .then(() => {
                    showNotification("Product deactivated");
                    fetchProducts();
                })
                .catch(err => showNotification("Failed to deactivate product", "error"));
        }
    };

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Product Management</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your store's product catalog.
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search SKU, Barcode, Brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 300, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{ borderRadius: "8px", textTransform: "none", fontWeight: "600" }}
                    >
                        Add Product
                    </Button>
                </Box>
            </Box>

            <Table sx={{ bgcolor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" }}>
                <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>SKU</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Barcode</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map(product => (
                        <TableRow key={product.product_id} hover>
                            <TableCell>{product.product_id}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.model}</TableCell>
                            <TableCell>{product.sku}</TableCell>
                            <TableCell>{product.barcode || "N/A"}</TableCell>
                            <TableCell>₹{product.price || product.base_price}</TableCell>
                            <TableCell>
                                <Box sx={{
                                    display: "inline-block",
                                    px: 1, py: 0.5,
                                    borderRadius: "4px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600",
                                    bgcolor: product.available_quantity > 5 ? "#e8f5e9" : "#ffebee",
                                    color: product.available_quantity > 5 ? "#2e7d32" : "#c62828"
                                }}>
                                    {product.available_quantity || 0}
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip title="Edit Product">
                                    <IconButton size="small" onClick={() => handleOpen(product)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Deactivate Product">
                                    <IconButton size="small" onClick={() => handleDelete(product.product_id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Brand"
                            name="brand"
                            fullWidth
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Model"
                            name="model"
                            fullWidth
                            value={formData.model}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            select
                            label="Product Type"
                            name="product_type"
                            fullWidth
                            value={formData.product_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="FRAME">FRAME</MenuItem>
                            <MenuItem value="LENS">LENS</MenuItem>
                            <MenuItem value="ACCESSORY">ACCESSORY</MenuItem>
                        </TextField>
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            fullWidth
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="SKU (Leave blank to auto-generate)"
                            name="sku"
                            fullWidth
                            value={formData.sku}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Barcode (Leave blank to auto-generate)"
                            name="barcode"
                            fullWidth
                            value={formData.barcode}
                            onChange={handleChange}
                        />
                        <TextField
                            label="Stock"
                            name="available_quantity"
                            type="number"
                            fullWidth
                            value={formData.available_quantity}
                            onChange={handleChange}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} sx={{ color: "text.secondary" }}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: "8px" }}>
                        {editProduct ? "Update Product" : "Create Product"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
