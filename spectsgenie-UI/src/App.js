
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import StoreSelect from "./pages/StoreSelect";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import NewInvoice from "./pages/NewInvoice";
import Layout from "./components/Layout";

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StoreSelect />} />
          <Route path="/login" element={<Login />} />

          <Route element={<LayoutWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing/new" element={<NewInvoice />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
