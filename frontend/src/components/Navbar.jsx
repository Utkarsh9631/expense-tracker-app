// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";

export default function NavbarComp() {
  const { isAuthenticated, logout, user } = useAppContext(); // <-- Get user object
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };
  
  // Use user's name if available, otherwise "Account"
  const accountTitle = user ? user.name : "Account";

  // Conditionally render links
  const authLinks = (
    <>
      <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={NavLink} to="/analytics">Analytics</Nav.Link>
      
      {/* Links you requested */}
      <NavDropdown title="Actions" id="actions-dropdown">
        <NavDropdown.Item as={NavLink} to="/add-expense">Add Expense</NavDropdown.Item>
        <NavDropdown.Item as={NavLink} to="/add-budget">Add Budget</NavDropdown.Item>
      </NavDropdown>

      {/* --- Updated this line --- */}
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
      {/* Anchor links to landing page sections */}
      <Nav.Link href="/#features">Features</Nav.Link>
      <Nav.Link href="/#pricing">Pricing</Nav.Link>
      <Nav.Link as={NavLink} to="/login" className="ms-lg-2">Login</Nav.Link>
      <Button as={NavLink} to="/signup" variant="primary" size="sm" className="ms-2">
        Sign Up
      </Button>
    </>
  );

  return (
    <Navbar expand="lg" bg="light" variant="light" className="shadow-sm sticky-top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">ExpensePro</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {isAuthenticated ? authLinks : guestLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}