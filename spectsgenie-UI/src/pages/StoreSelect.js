import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
    Box,
    Container,
    Typography,
    TextField,
    Card,
    CardContent,
    Stack,
    Chip,
    IconButton,
    InputAdornment,
    Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CircleIcon from "@mui/icons-material/Circle";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GlassesIcon from "@mui/icons-material/Visibility"; // Placeholder for glasses

export default function StoreSelect() {
    const [stores, setStores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Determine the API endpoint. 
        // The previous task setup `/stores` in API Gateway to point to store-service `/`.
        api.get("/stores/")
            .then(res => {
                console.log("Stores API response:", res.data);
                if (Array.isArray(res.data)) {
                    setStores(res.data);
                } else {
                    console.error("Expected array but got:", typeof res.data, res.data);
                    setStores([]);
                }
            })
            .catch(err => console.error("Failed to load stores", err));
    }, []);

    const filteredStores = stores.filter(s =>
        s.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", py: 8 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: "center", mb: 6 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            bgcolor: "#00b894",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                            color: "white"
                        }}
                    >
                        <GlassesIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        SpecsGenie <span style={{ color: "#00b894" }}>POS</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select your store to continue
                    </Typography>
                </Box>

                <TextField
                    fullWidth
                    placeholder="Search stores by name or location..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        mb: 4,
                        bgcolor: "white",
                        "& .MuiOutlinedInput-root": { borderRadius: "100px" }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack spacing={2}>
                    {filteredStores.map(store => (
                        <Card
                            key={store.id}
                            onClick={() => {
                                localStorage.setItem("selectedStore", JSON.stringify(store));
                                window.location.href = "/dashboard";
                            }}
                            sx={{
                                borderRadius: "16px",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", cursor: "pointer" }
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", p: 3, "&:last-child": { pb: 3 } }}>
                                <Avatar
                                    sx={{
                                        bgcolor: "#e0f7fa",
                                        color: "#00b894",
                                        width: 56,
                                        height: 56,
                                        mr: 3,
                                        borderRadius: "12px"
                                    }}
                                >
                                    <StorefrontIcon />
                                </Avatar>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight="600">{store.store_name}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {store.city}, {store.state}
                                    </Typography>
                                    <Stack direction="row" spacing={1}>
                                        <Chip
                                            icon={<CircleIcon sx={{ fontSize: "10px !important" }} />}
                                            label="Active"
                                            size="small"
                                            sx={{
                                                bgcolor: "#e6fffa",
                                                color: "#00b894",
                                                fontWeight: "500",
                                                "& .MuiChip-icon": { color: "#00b894" }
                                            }}
                                        />
                                        <Chip
                                            icon={store.is_online ? <CloudQueueIcon sx={{ fontSize: "16px !important" }} /> : <CloudOffIcon sx={{ fontSize: "16px !important" }} />}
                                            label={store.is_online ? "Online" : "Offline Only"}
                                            size="small"
                                            sx={{
                                                bgcolor: store.is_online ? "#e3f2fd" : "#f5f5f5",
                                                color: store.is_online ? "#2196f3" : "#757575",
                                                fontWeight: "500",
                                                "& .MuiChip-icon": { color: store.is_online ? "#2196f3" : "#757575" }
                                            }}
                                        />
                                    </Stack>
                                </Box>

                                <IconButton>
                                    <ChevronRightIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
}
