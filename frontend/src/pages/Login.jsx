// src/pages/Login.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // <-- Import context

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAppContext(); // <-- Get login function

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Call login function from context
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || "Failed to log in");
    }
  };

  // ... (rest of your return code is the same)
  // Make sure you have the {error && <Alert...>} block
  return (
    <Card className="mx-auto" style={{maxWidth: 520}}>
      <Card.Body>
        <h4 className="mb-3">Log in</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          {/* ... all your Form.Group fields ... */}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              placeholder="you@company.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              placeholder="••••••••"
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Button type="submit" variant="primary">Login</Button>
            <Button variant="link" onClick={() => navigate("/signup")}>Create account</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}