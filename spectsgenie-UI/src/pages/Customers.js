import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    Avatar,
    IconButton,
    InputBase,
    Paper,
    Button,
    Chip,
    CircularProgress,
    Stack,
    Menu,
    MenuItem
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterListIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Star as StarIcon,
    Message as MessageIcon,
    Phone as PhoneIcon,
    MoreVert as MoreVertIcon,
    ReceiptLong as HistoryIcon,
    Add as AddIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    Snackbar,
    Alert,
    Tooltip
} from "@mui/material";
import api from "../api/axios";

const CustomerCard = ({ customer, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const initials = customer.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "C";

    const colors = ["#4834d4", "#eb4d4b", "#6ab04c", "#f0932b", "#22a6b3", "#be2edd"];
    const bgColor = colors[initials.charCodeAt(0) % colors.length];

    const formatCurrency = (amountPaise) => {
        return (amountPaise / 100).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        });
    };

    return (
        <Card sx={{
            p: 2,
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
            border: "1px solid #f0f0f0",
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 12px 48px rgba(0,0,0,0.08)",
                borderColor: "#e0e0e0"
            }
        }}>
            <IconButton
                size="small"
                sx={{ position: "absolute", top: 12, right: 12 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem onClick={() => { onEdit(customer); setAnchorEl(null); }}>Edit Profile</MenuItem>
                <MenuItem onClick={() => { onDelete(customer.customer_id); setAnchorEl(null); }} sx={{ color: "error.main" }}>Delete</MenuItem>
            </Menu>

            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ position: "relative" }}>
                    <Avatar sx={{
                        bgcolor: bgColor,
                        width: 64,
                        height: 64,
                        fontSize: "1.4rem",
                        fontWeight: "800",
                        borderRadius: "16px",
                        boxShadow: `0 8px 16px ${bgColor}44`
                    }}>
                        {initials}
                    </Avatar>
                    {customer.is_vip && (
                        <Box sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "#f1c40f",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}>
                            <StarIcon sx={{ color: "white", fontSize: "16px" }} />
                        </Box>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="h6" fontWeight="800" noWrap sx={{ letterSpacing: "-0.5px" }}>
                        {customer.name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                            {customer.phone}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "divider" }} />
                        <Chip
                            label={customer.gender === "MALE" ? "Male" : "Female"}
                            size="small"
                            variant="outlined"
                            icon={customer.gender === "MALE" ? <MaleIcon sx={{ fontSize: "14px !important" }} /> : <FemaleIcon sx={{ fontSize: "14px !important" }} />}
                            sx={{ height: 20, fontSize: "10px", fontWeight: "700", border: "none", bgcolor: "#f5f5f5" }}
                        />
                    </Stack>
                </Box>
            </Stack>

            <Grid container sx={{ mt: 3, p: 2, bgcolor: "#fafafa", borderRadius: "16px" }}>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase", fontSize: "10px" }}>Visits</Typography>
                    <Typography variant="h6" fontWeight="800" color="primary.main">{customer.total_visits || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ textTransform: "uppercase", fontSize: "10px" }}>Total Spent</Typography>
                    <Typography variant="h6" fontWeight="800">{formatCurrency(customer.total_spent || 0)}</Typography>
                </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1.5}>
                    <Tooltip title="Call Customer">
                        <IconButton size="small" sx={{ bgcolor: "#f0fdf4", color: "#16a34a", "&:hover": { bgcolor: "#dcfce7" } }}>
                            <PhoneIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Message">
                        <IconButton size="small" sx={{ bgcolor: "#eff6ff", color: "#2563eb", "&:hover": { bgcolor: "#dbeafe" } }}>
                            <MessageIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Order History">
                        <IconButton size="small" sx={{ bgcolor: "#fff7ed", color: "#ea580c", "&:hover": { bgcolor: "#ffedd5" } }}>
                            <HistoryIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: "700", color: "#94a3b8" }}>
                    LAST: {customer.last_visit ? new Date(customer.last_visit).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }).toUpperCase() : "NEVER"}
                </Typography>
            </Box>
        </Card>
    );
};

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "MALE",
        is_vip: false
    });
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const fetchCustomers = useCallback(async (query = "", sort = "recent") => {
        setLoading(true);
        try {
            const params = { q: query, sort_by: sort };
            const res = await api.get("/customers/", { params });
            setCustomers(res.data);
        } catch (err) {
            console.error("Failed to fetch customers:", err);
            showNotification("Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchCustomers(searchTerm, sortBy);
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, sortBy, fetchCustomers]);

    const showNotification = (message, severity = "success") => {
        setNotification({ open: true, message, severity });
    };

    const handleOpenModal = (customer = null) => {
        if (customer) {
            setEditMode(true);
            setSelectedCustomer(customer);
            setFormData({
                name: customer.name || "",
                phone: customer.phone || "",
                email: customer.email || "",
                gender: customer.gender || "MALE",
                is_vip: customer.is_vip || false
            });
        } else {
            setEditMode(false);
            setSelectedCustomer(null);
            setFormData({
                name: "",
                phone: "",
                email: "",
                gender: "MALE",
                is_vip: false
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && selectedCustomer) {
                await api.put(`/customers/${selectedCustomer.customer_id}`, formData);
                showNotification("Customer updated successfully");
            } else {
                await api.post("/customers/", formData);
                showNotification("Customer added successfully");
            }
            handleCloseModal();
            fetchCustomers(searchTerm, sortBy);
        } catch (err) {
            console.error("Failed to save customer:", err);
            const errorMsg = err.response?.data?.detail || "Action failed";
            showNotification(typeof errorMsg === 'string' ? errorMsg : "Request failed", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await api.delete(`/customers/${id}`);
                showNotification("Customer deleted successfully");
                fetchCustomers(searchTerm, sortBy);
            } catch (err) {
                showNotification("Failed to delete customer", "error");
            }
        }
    };

    const sortLabels = {
        recent: "Recent First",
        spent: "High Spenders",
        visits: "Most Visits"
    };

    return (
        <Box sx={{ p: 3, maxWidth: "1400px", mx: "auto" }}>
            {/* Header / Search Area */}
            <Box sx={{ mb: 6, display: "flex", gap: 2, alignItems: "center" }}>
                <Paper
                    sx={{
                        p: "6px 16px",
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 1,
                        borderRadius: "100px",
                        bgcolor: "white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                        border: "1px solid #f0f0f0"
                    }}
                >
                    <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontWeight: "500" }}
                        placeholder="Search by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Paper>

                <Button
                    startIcon={<FilterListIcon />}
                    variant="outlined"
                    sx={{
                        borderRadius: "100px",
                        borderColor: "#f0f0f0",
                        color: "text.primary",
                        textTransform: "none",
                        fontWeight: "700",
                        height: "48px",
                        px: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        "&:hover": { borderColor: "#ddd", bgcolor: "#f9f9f9" }
                    }}
                >
                    Filters
                </Button>

                <Button
                    endIcon={<KeyboardArrowDownIcon />}
                    variant="outlined"
                    sx={{
                        borderRadius: "100px",
                        borderColor: "#f0f0f0",
                        color: "text.primary",
                        textTransform: "none",
                        fontWeight: "700",
                        height: "48px",
                        px: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        "&:hover": { borderColor: "#ddd", bgcolor: "#f9f9f9" }
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    {sortLabels[sortBy]}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem onClick={() => { setSortBy("recent"); setAnchorEl(null); }}>Recent First</MenuItem>
                    <MenuItem onClick={() => { setSortBy("spent"); setAnchorEl(null); }}>High Spenders</MenuItem>
                    <MenuItem onClick={() => { setSortBy("visits"); setAnchorEl(null); }}>Most Visits</MenuItem>
                </Menu>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{
                        borderRadius: "100px",
                        height: "48px",
                        px: 4,
                        textTransform: "none",
                        fontWeight: "800",
                        boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)",
                        bgcolor: "#1976d2",
                        "&:hover": { bgcolor: "#1565c0", boxShadow: "0 12px 24px rgba(25, 118, 210, 0.4)" }
                    }}
                >
                    Add Customer
                </Button>
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: "700" }}>
                Active Records: <Typography component="span" fontWeight="900" color="primary">{customers.length}</Typography>
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
                    <CircularProgress thickness={5} size={60} sx={{ color: "#1976d2" }} />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {customers.map((customer) => (
                        <Grid item xs={12} sm={6} md={4} xl={3} key={customer.customer_id}>
                            <CustomerCard
                                customer={customer}
                                onEdit={handleOpenModal}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                    {customers.length === 0 && (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: "center", py: 15, bgcolor: "#fcfcfc", borderRadius: "32px", border: "2px dashed #f0f0f0" }}>
                                <Typography color="text.secondary" fontWeight="700">No member profiles found matching your criteria.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Create/Edit Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}>
                <DialogTitle sx={{ fontWeight: "900", fontSize: "1.5rem", pb: 1 }}>
                    {editMode ? "Edit Profile" : "New Customer"}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="e.g. John Doe"
                            />
                            <TextField
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                required
                                placeholder="e.g. 9876543210"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                placeholder="e.g. john@example.com"
                            />
                            <FormControl fullWidth>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                    <MenuItem value="OTHER">Other</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="is_vip"
                                        checked={formData.is_vip}
                                        onChange={handleChange}
                                        color="primary"
                                    />
                                }
                                label={<Typography fontWeight="700">VIP Customer (Priority Status)</Typography>}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button onClick={handleCloseModal} sx={{ borderRadius: "100px", textTransform: "none", fontWeight: "700", color: "text.secondary" }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={editMode ? <SaveIcon /> : <AddIcon />}
                            sx={{ borderRadius: "100px", px: 4, textTransform: "none", fontWeight: "800" }}
                        >
                            {editMode ? "Save Changes" : "Create Record"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity} variant="filled" sx={{ borderRadius: "12px", fontWeight: "700" }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
