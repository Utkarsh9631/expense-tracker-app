// src/components/Footer.jsx
import React from "react";
// --- MODIFIED: Import Bootstrap components ---
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-4 py-md-5 text-muted mt-5 bg-body-tertiary">
      {/* --- MODIFIED: Added a structured footer --- */}
      <Container>
        <Row className="gy-3">
          <Col lg={4} md={12} className="text-center text-md-start">
            <h5 className="fw-bold text-body">ExpensePro</h5>
            <small>
              © {new Date().getFullYear()} ExpensePro — Track. Analyze. Grow.
            </small>
          </Col>

          <Col lg={2} md={3} xs={6}>
            <h6 className="text-body">Pages</h6>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="p-0 text-muted">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard" className="p-0 text-muted">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/login" className="p-0 text-muted">Login</Nav.Link>
              <Nav.Link as={Link} to="/signup" className="p-0 text-muted">Sign Up</Nav.Link>
            </Nav>
          </Col>

          <Col lg={2} md={3} xs={6}>
            <h6 className="text-body">Sections</h6>
            <Nav className="flex-column">
              <Nav.Link href="/#features" className="p-0 text-muted">Features</Nav.Link>
              <Nav.Link href="/#how-it-works" className="p-0 text-muted">How it Works</Nav.Link>
              <Nav.Link href="/#pricing" className="p-0 text-muted">Pricing</Nav.Link>
            </Nav>
          </Col>

          <Col lg={2} md={3} xs={6}>
            <h6 className="text-body">Legal</h6>
            <Nav className="flex-column">
              <Nav.Link href="#" className="p-0 text-muted">Privacy</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">Terms</Nav.Link>
            </Nav>
          </Col>

           <Col lg={2} md={3} xs={6}>
            <h6 className="text-body">Social</h6>
            <Nav className="flex-column">
              <Nav.Link href="#" className="p-0 text-muted">GitHub</Nav.Link>
              <Nav.Link href="#" className="p-0 text-muted">LinkedIn</Nav.Link>
            </Nav>
          </Col>
        </Row>
      </Container>
      {/* --- END MODIFICATION --- */}
    </footer>
  );
}