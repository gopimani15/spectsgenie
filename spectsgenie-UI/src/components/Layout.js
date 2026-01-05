import React, { useContext } from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    IconButton,
    InputBase,
    Paper,
    Divider
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    Inventory as InventoryIcon,
    ShoppingCart as ShoppingCartIcon,
    People as PeopleIcon,
    LocalShipping as LocalShippingIcon,
    Assessment as AssessmentIcon,
    Settings as SettingsIcon,
    Search as SearchIcon,
    NotificationsNone as NotificationsIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 260;

export default function Layout({ children }) {
    const router = useRouter(); // Use Next.js router
    const { user, logout } = useContext(AuthContext);

    const navigate = (path) => router.push(path); // Adapter for compatibility if needed, or just use router.push direct
    const location = router; // Adapter for compatibility

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "New Sale", icon: <ReceiptIcon />, path: "/billing/new", active: true },
        { text: "Customers", icon: <PeopleIcon />, path: "/customers" },
        { text: "Orders", icon: <ShoppingCartIcon />, path: "/orders" },
        { text: "Deliveries", icon: <LocalShippingIcon />, path: "/deliveries" },
        { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
        { text: "Products", icon: <AssessmentIcon />, path: "/product-management" },
    ];

    const filteredMenuItems = menuItems;

    return (
        <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        borderRight: "none",
                        bgcolor: "white"
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#00b894" }}>SG</Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">SpecsGenie</Typography>
                        <Typography variant="caption" color="text.secondary">Jubilee Hills</Typography>
                    </Box>
                </Box>

                <List sx={{ px: 2 }}>
                    {filteredMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => router.push(item.path)}
                                selected={router.pathname === item.path} // Use router.pathname
                                sx={{
                                    borderRadius: "8px",
                                    bgcolor: item.text === "New Sale" ? "#e6fffa !important" : "transparent",
                                    color: item.text === "New Sale" ? "#00b894" : "text.primary",
                                    "& .MuiListItemIcon-root": {
                                        color: item.text === "New Sale" ? "#00b894" : "text.secondary"
                                    }
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: item.text === "New Sale" ? 600 : 400 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: "auto", p: 2 }}>
                    <ListItemButton onClick={logout} sx={{ borderRadius: "8px", color: "error.main" }}>
                        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </Box>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
                    <Toolbar disableGutters>
                        <Box sx={{ flexGrow: 1 }} />
                        <Paper
                            component="form"
                            sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400, borderRadius: "100px", bgcolor: "white", boxShadow: "none", mr: 2 }}
                        >
                            <IconButton sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search.."
                                inputProps={{ "aria-label": "search" }}
                            />
                        </Paper>
                        <IconButton>
                            <NotificationsIcon />
                        </IconButton>
                        <Avatar sx={{ ml: 2, bgcolor: "#00b894" }}>{user?.username?.[0]?.toUpperCase() || "U"}</Avatar>
                    </Toolbar>
                </AppBar>
                {children}
            </Box>
        </Box>
    );
}
