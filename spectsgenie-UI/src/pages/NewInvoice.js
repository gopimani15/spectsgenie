import React, { useState, useEffect } from "react";
import api from "../api/axios";
import BarcodeScannerComponent from "react-barcode-reader";
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Divider,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

export default function NewInvoice() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [lineItems, setLineItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [customerSearchResults, setCustomerSearchResults] = useState([]);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [lastScannedCode, setLastScannedCode] = useState("");

    // Debounced search for customers
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (customerSearchTerm.length > 2) {
                api.get(`/customers?q=${encodeURIComponent(customerSearchTerm)}&skip=0&limit=100`)
                    .then(res => {
                        setCustomerSearchResults(res.data || []);
                    })
                    .catch(err => console.error("Customer search failed", err));
            } else {
                setCustomerSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [customerSearchTerm]);

    // Debounced search for products
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length > 2) {
                const store = JSON.parse(localStorage.getItem("selectedStore"));
                const storeId = store ? store.store_id || 1 : 1;

                api.get(`/read/search?q=${encodeURIComponent(searchTerm)}&store_id=${storeId}`)
                    .then(res => {
                        setSearchResults(res.data || []);
                    })
                    .catch(err => console.error("Search failed", err));
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const addToCart = (product) => {
        setLineItems(prev => {
            const existing = prev.find(item => item.product_id === product.product_id);
            if (existing) {
                return prev.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setSearchTerm(""); // Clear search after adding
    };

    const removeFromCart = (productId) => {
        setLineItems(prev => prev.filter(item => item.product_id !== productId));
    };

    const selectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearchTerm("");
        setCustomerSearchResults([]);
    };

    const handleBarcodeScan = (barcode) => {
        if (!barcode || barcode === lastScannedCode) return;

        setLastScannedCode(barcode);
        setScannerOpen(false);

        // Search for product by barcode using the dedicated endpoint
        const store = JSON.parse(localStorage.getItem("selectedStore"));
        const storeId = store ? store.store_id || 1 : 1;

        api.get(`/read/barcode/${encodeURIComponent(barcode)}?store_id=${storeId}`)
            .then(res => {
                if (res.data) {
                    addToCart(res.data);
                } else {
                    alert(`No product found with barcode: ${barcode}`);
                }
            })
            .catch(err => {
                console.error("Barcode search failed", err);
                if (err.response && err.response.status === 404) {
                    alert(`No product found with barcode: ${barcode}`);
                } else {
                    alert("Failed to search for product");
                }
            });

        // Reset last scanned code after 2 seconds to allow rescanning
        setTimeout(() => setLastScannedCode(""), 2000);
    };

    const handleBarcodeError = (err) => {
        console.error("Barcode scanner error:", err);
    };

    const subtotal = lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18; // 18% tax example
    const total = subtotal + tax;

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>New Invoice</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Create a new bill for walk-in or existing customer
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    {/* Customer Selection */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", position: "relative" }} elevation={0}>
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>Customer</Typography>
                        {selectedCustomer ? (
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, bgcolor: "#e6fffa", borderRadius: "8px" }}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="600">{selectedCustomer.name || "Walk-in Customer"}</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedCustomer.phone}</Typography>
                                    {selectedCustomer.email && <Typography variant="body2" color="text.secondary">{selectedCustomer.email}</Typography>}
                                </Box>
                                <Button size="small" onClick={() => setSelectedCustomer(null)}>Change</Button>
                            </Box>
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name, phone, or email..."
                                    variant="outlined"
                                    value={customerSearchTerm}
                                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                                    }}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                                />
                                {customerSearchResults.length > 0 && (
                                    <Paper sx={{ position: "absolute", zIndex: 10, width: "calc(100% - 48px)", maxHeight: 300, overflow: "auto", mt: 1 }}>
                                        <List>
                                            {customerSearchResults.map(customer => (
                                                <ListItem button key={customer.customer_id} onClick={() => selectCustomer(customer)}>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: "#00b894" }}><PersonOutlineIcon /></Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={customer.name || "No Name"}
                                                        secondary={`${customer.phone}${customer.email ? ` • ${customer.email}` : ""}`}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                )}
                            </>
                        )}
                    </Paper>

                    {/* Line Items */}
                    <Paper sx={{ p: 3, borderRadius: "12px", minHeight: 400 }} elevation={0}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600">Line Items</Typography>
                            <Typography variant="body2" color="text.secondary">{lineItems.length} items</Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                            <TextField
                                fullWidth
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                            />
                            <IconButton
                                onClick={() => setScannerOpen(true)}
                                sx={{
                                    bgcolor: "#00b894",
                                    color: "white",
                                    "&:hover": { bgcolor: "#00a180" },
                                    borderRadius: "8px",
                                    width: 56,
                                    height: 56
                                }}
                            >
                                <QrCodeScannerIcon />
                            </IconButton>
                        </Box>

                        {/* Search Results Dropdown (Simplified as a list) */}
                        {searchTerm && searchResults.length > 0 && (
                            <Paper sx={{ position: "absolute", zIndex: 10, width: "50%", maxHeight: 300, overflow: "auto", mt: -2 }}>
                                <List>
                                    {searchResults.map(product => (
                                        <ListItem button key={product.product_id} onClick={() => addToCart(product)}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "#e0f7fa", color: "#006064" }}>{product.brand[0]}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${product.brand} - ${product.model}`}
                                                secondary={`₹${product.price} | Stock: ${product.available_quantity}`}
                                            />
                                            <IconButton><AddIcon /></IconButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}

                        <List>
                            {lineItems.map(item => (
                                <React.Fragment key={item.product_id}>
                                    <ListItem
                                        secondaryAction={
                                            <Box sx={{ textAlign: "right" }}>
                                                <Typography variant="subtitle2" fontWeight="bold">₹{item.price * item.quantity}</Typography>
                                                <IconButton edge="end" size="small" onClick={() => removeFromCart(item.product_id)}>
                                                    <DeleteOutlineIcon fontSize="small" color="error" />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar variant="rounded" sx={{ bgcolor: "#f5f5f5", color: "#616161" }}>
                                                <ReceiptIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${item.brand} ${item.model}`}
                                            secondary={item.sku ? `SKU: ${item.sku}` : `Qty: ${item.quantity}`}
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            ))}
                        </List>

                        {lineItems.length === 0 && !searchTerm && (
                            <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                                <Typography>No items added yet</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <Card elevation={0} sx={{ borderRadius: "12px" }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Order Summary</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                                        <Typography color="text.secondary">Subtotal</Typography>
                                        <Typography fontWeight="500">₹{subtotal.toFixed(2)}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="#00b894" sx={{ mb: 2, cursor: "pointer" }}>+ Add Additional Discount</Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography color="text.secondary">GST (18%)</Typography>
                                        <Typography color="text.secondary">₹{tax.toFixed(2)}</Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">Grand Total</Typography>
                                        <Typography variant="h6" fontWeight="bold">₹{total.toFixed(2)}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item>
                            <Card elevation={0} sx={{ borderRadius: "12px" }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>Payment</Typography>
                                    <Button variant="outlined" fullWidth sx={{ mb: 2, borderStyle: "dashed", height: 48 }}>
                                        + Add Payment
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{
                                    bgcolor: "#00b894",
                                    height: 56,
                                    fontWeight: "bold",
                                    fontSize: "1rem",
                                    "&:hover": { bgcolor: "#00a180" }
                                }}
                            >
                                Generate Invoice
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Barcode Scanner Dialog */}
            <Dialog
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <QrCodeScannerIcon color="primary" />
                        <Typography variant="h6">Scan Barcode</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        py: 2
                    }}>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Position the barcode within the camera view
                        </Typography>
                        <Box sx={{
                            width: "100%",
                            minHeight: 300,
                            bgcolor: "#f5f5f5",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {scannerOpen && (
                                <BarcodeScannerComponent
                                    onUpdate={(err, result) => {
                                        if (result) {
                                            handleBarcodeScan(result.text);
                                        }
                                        if (err) {
                                            handleBarcodeError(err);
                                        }
                                    }}
                                />
                            )}
                        </Box>
                        {lastScannedCode && (
                            <Typography variant="body2" color="success.main">
                                Last scanned: {lastScannedCode}
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScannerOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
