import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../src/api/axios";

const STATUS_COLORS = {
  Ordered: "#90caf9",
  "In Lab": "#ffe082",
  Ready: "#b2dfdb",
  Delivered: "#cfd8dc",
  "Due Today": "#e0f7fa",
  Overdue: "#ffcdd2",
};

const STATUS_LABELS = [
  { key: "Ordered", color: STATUS_COLORS.Ordered },
  { key: "In Lab", color: STATUS_COLORS["In Lab"] },
  { key: "Ready", color: STATUS_COLORS.Ready },
  { key: "Delivered", color: STATUS_COLORS.Delivered },
  { key: "Due Today", color: STATUS_COLORS["Due Today"] },
  { key: "Overdue", color: STATUS_COLORS.Overdue },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [dueDateSort, setDueDateSort] = useState("Earliest");
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    // Fetch orders from API gateway
    api.get("/orders")
      .then((res) => {
        setOrders(res.data || []);
        // Calculate status counts
        const counts = {
          Ordered: 0,
          "In Lab": 0,
          Ready: 0,
          Delivered: 0,
          "Due Today": 0,
          Overdue: 0,
        };
        (res.data || []).forEach((order) => {
          if (counts[order.status] !== undefined) counts[order.status]++;
          if (order.is_due_today) counts["Due Today"]++;
          if (order.is_overdue) counts["Overdue"]++;
        });
        setStatusCounts(counts);
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      if (
        searchTerm &&
        !(
          order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_phone?.includes(searchTerm)
        )
      ) {
        return false;
      }
      if (deliveryFilter && order.delivery_type !== deliveryFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (dueDateSort === "Earliest") {
        return new Date(a.due_date) - new Date(b.due_date);
      } else {
        return new Date(b.due_date) - new Date(a.due_date);
      }
    });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {orders.length} total orders · {statusCounts.Overdue || 0} overdue
      </Typography>
      <Grid container spacing={2} mb={3}>
        {STATUS_LABELS.map((status) => (
          <Grid item xs={6} sm={2} key={status.key}>
            <Card sx={{ bgcolor: status.color, borderRadius: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {statusCounts[status.key] || 0}
                </Typography>
                <Typography variant="body2">{status.key}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by order #, customer name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 350, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Select
          size="small"
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          displayEmpty
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All Delivery</MenuItem>
          <MenuItem value="Store Pickup">Store Pickup</MenuItem>
          <MenuItem value="Home Delivery">Home Delivery</MenuItem>
        </Select>
        <Select
          size="small"
          value={dueDateSort}
          onChange={(e) => setDueDateSort(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="Earliest">Due Date (Earliest)</MenuItem>
          <MenuItem value="Latest">Due Date (Latest)</MenuItem>
        </Select>
      </Box>
      <Box>
        {filteredOrders.map((order) => (
          <Card key={order.order_id} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {order.order_number}
                  </Typography>
                  <Chip
                    label={order.status}
                    color="primary"
                    size="small"
                    sx={{ mr: 1, bgcolor: STATUS_COLORS[order.status] || "#e0e0e0" }}
                  />
                  {order.is_overdue && (
                    <Chip label="Overdue" color="error" size="small" sx={{ mr: 1 }} />
                  )}
                  {order.status === "Delivered" && (
                    <Chip label="Delivered" color="success" size="small" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {order.customer_name} <br />
                    <span style={{ fontSize: "0.9em" }}>{order.customer_phone}</span>
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{order.total_price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.payment_status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.delivery_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.due_date && `${order.due_days_ago} days ago`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {order.items?.map((item, idx) => (
                    <span key={idx}>
                      {item.quantity}× {item.name}
                      {idx < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </Typography>
                {/* Progress bar or timeline can be added here if needed */}
              </Box>
            </CardContent>
          </Card>
        ))}
        {filteredOrders.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            No orders found.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
