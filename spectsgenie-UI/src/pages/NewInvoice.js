import React, { useState, useEffect } from "react";
import api from "../api/axios";
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
    CardContent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ReceiptIcon from "@mui/icons-material/Receipt";

export default function NewInvoice() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [lineItems, setLineItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearchTerm, setCustomerSearchTerm] = useState("");
    const [customerSearchResults, setCustomerSearchResults] = useState([]);

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
                // Assuming we can search by brand or model. Ideally backend supports search query.
                // For now fetching store products and filtering client side as per previous task setup
                const store = JSON.parse(localStorage.getItem("selectedStore"));
                const storeId = store ? store.store_id || 1 : 1;

                api.get(`/read/store/${storeId}`)
                    .then(res => {
                        const filtered = res.data.filter(p =>
                            p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.model?.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        setSearchResults(filtered);
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

                        <TextField
                            fullWidth
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>
                            }}
                            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                        />

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
        </Box>
    );
}
