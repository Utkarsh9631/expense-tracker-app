// src/components/Navbar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button, NavDropdown, Form } from "react-bootstrap"; 
import { useAppContext } from "../context/AppContext";

export default function NavbarComp() {
  const { 
    isAuthenticated, 
    logout, 
    user, 
    theme, 
    toggleTheme,
    // Notification props
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications
  } = useAppContext();
  
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };
  
  const accountTitle = user ? user.name : "Account";

  // Theme Toggle Switch
  const themeToggle = (
    <Form.Check
      type="switch"
      id="theme-switch"
      label={theme === 'light' ? '🌙' : '☀️'}
      checked={theme === 'dark'}
      onChange={toggleTheme}
      className="ms-lg-3"
    />
  );

  // Notification Dropdown
  const notificationDropdown = (
    <NavDropdown 
      title={
        <div className="d-inline-block position-relative">
          <span className="fs-5" role="img" aria-label="notifications">🔔</span> 
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem'}}>
              {unreadCount}
            </span>
          )}
        </div>
      } 
      id="notif-dropdown" 
      align="end"
    >
      <div style={{ maxHeight: '300px', overflowY: 'auto', minWidth: '280px' }}>
        {notifications.length === 0 ? (
          <NavDropdown.Item disabled>No notifications</NavDropdown.Item>
        ) : (
          notifications.map((notif) => (
            <NavDropdown.Item 
              key={notif._id} 
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              style={{ 
                backgroundColor: notif.isRead ? 'transparent' : (theme === 'dark' ? '#2c3e50' : '#f0f8ff'),
                borderBottom: '1px solid #eee',
                whiteSpace: 'normal'
              }}
            >
              <div className="d-flex justify-content-between">
                <small className={notif.type === 'danger' ? 'text-danger fw-bold' : 'text-warning fw-bold'}>
                  {notif.type === 'danger' ? 'Alert' : 'Warning'}
                </small>
                <small className="text-muted" style={{fontSize: '0.7em'}}>
                  {new Date(notif.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div style={{fontSize: '0.85rem', marginTop: '2px'}}>{notif.message}</div>
            </NavDropdown.Item>
          ))
        )}
      </div>
      {notifications.length > 0 && (
        <>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={clearNotifications} className="text-center text-primary small">
            Clear All
          </NavDropdown.Item>
        </>
      )}
    </NavDropdown>
  );

  const authLinks = (
    <>
      <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
      <Nav.Link as={NavLink} to="/analytics">Analytics</Nav.Link>
      
      {/* Notification Bell */}
      {notificationDropdown}

      <NavDropdown title="Actions" id="actions-dropdown">
        <NavDropdown.Item as={NavLink} to="/add-expense">Add Expense</NavDropdown.Item>
        <NavDropdown.Item as={NavLink} to="/add-budget">Add Budget</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item as={NavLink} to="/subscriptions">Manage Subscriptions</NavDropdown.Item>
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
      bg={theme} 
      variant={theme} 
      className="shadow-sm sticky-top"
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="fw-bold">ExpensePro</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {isAuthenticated ? authLinks : guestLinks}
            {themeToggle}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}