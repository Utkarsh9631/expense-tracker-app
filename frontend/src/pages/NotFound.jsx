// src/pages/NotFound.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Card className="text-center mx-auto" style={{ maxWidth: 500, marginTop: "10vh" }}>
      <Card.Body>
        <h1 className="display-1 fw-bold">404</h1>
        <Card.Title className="fs-3">Page Not Found</Card.Title>
        <Card.Text className="text-muted">
          Sorry, the page you are looking for does not exist.
        </Card.Text>
        <Button as={Link} to="/" variant="primary">
          Go to Homepage
        </Button>
      </Card.Body>
    </Card>
  );
}