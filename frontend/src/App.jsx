// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarComp from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import AddBudget from "./pages/AddBudget";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
            <Route path="/add-budget" element={<AddBudget />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* TODO: Add a 404 Not Found route */}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;