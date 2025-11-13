// src/pages/Signup.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // <-- Import context

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAppContext(); // <-- Get register function

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Call register function from context
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || "Failed to create account");
    }
  };

  // ... (rest of your return code is the same)
  // Make sure you have the {error && <Alert...>} block like I added before
  return (
    <Card className="mx-auto" style={{maxWidth: 520}}>
      <Card.Body>
        <h4 className="mb-3">Create account</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          {/* ... all your Form.Group fields ... */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Jane Doe"
              required
            />
          </Form.Group>

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
              placeholder="Create a password"
              minLength="6"
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center">
            <Button type="submit" variant="primary">Sign up</Button>
            <Button variant="link" onClick={() => navigate("/login")}>Already have an account?</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}