// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarComp from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddBudget from "./pages/AddBudget";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound"; // <-- 1. Import the new page
import Subscriptions from "./pages/Subscriptions";
function App() {
  return (
    <>
      <NavbarComp />
      <ScrollToHash />
      <main className="container my-4">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-expense/:id" element={<AddExpense />} />
            <Route path="/add-budget" element={<AddBudget />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
          </Route>
          
          {/* --- 404 Not Found Route --- */}
          {/* 2. Add this line at the very end */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;