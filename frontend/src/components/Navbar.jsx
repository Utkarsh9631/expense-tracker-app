// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
// 1. Import Form
import { Navbar, Container, Nav, Button, NavDropdown, Form } from "react-bootstrap"; 
import { useAppContext } from "../context/AppContext";

export default function NavbarComp() {
  // 2. Get theme and toggleTheme from context
  const { isAuthenticated, logout, user, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };
  
  const accountTitle = user ? user.name : "Account";

  // 3. Define the theme toggle switch component
  const themeToggle = (
    <Form.Check
      type="switch"
      id="theme-switch"
      // Use emoji for a simple icon
      label={theme === 'light' ? '🌙' : '☀️'}
      checked={theme === 'dark'}
      onChange={toggleTheme}
      className="ms-lg-3"
    />
  );

  const authLinks = (
    <>
      <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={NavLink} to="/analytics">Analytics</Nav.Link>
      
      <NavDropdown title="Actions" id="actions-dropdown">
        <NavDropdown.Item as={NavLink} to="/add-expense">Add Expense</NavDropdown.Item>
        <NavDropdown.Item as={NavLink} to="/add-budget">Add Budget</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title={accountTitle} id="account-dropdown" align="end">
        <NavDropdown.Item as={NavLink} to="/settings">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onLogout}>
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    </>
  );

  const guestLinks = (
    <>
      <Nav.Link href="/#features">Features</Nav.Link>
      <Nav.Link href="/#pricing">Pricing</Nav.Link>
      <Nav.Link as={NavLink} to="/login" className="ms-lg-2">Login</Nav.Link>
      <Button as={NavLink} to="/signup" variant="primary" size="sm" className="ms-2">
        Sign Up
      </Button>
    </>
  );

return (
    <Navbar 
      expand="lg" 
      // --- THIS IS THE FIX ---
      // Use the theme state to set the props dynamically
      bg={theme} 
      variant={theme} 
      // --- END OF FIX ---
      className="shadow-sm sticky-top"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">ExpensePro</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {isAuthenticated ? authLinks : guestLinks}
            {/* 4. Add the toggle switch to the navbar */}
            {themeToggle}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}