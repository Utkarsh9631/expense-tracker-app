// src/pages/Signup.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAppContext(); 

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data);
      setError(err.response?.data?.msg || "Failed to create account");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Google signup failed");
    }
  };

  return (
    <Card className="mx-auto" style={{maxWidth: 520}}>
      <Card.Body>
        <h4 className="mb-3">Create account</h4>
        {error && <Alert variant="danger">{error}</Alert>}

        <Stack gap={3}>
          <Form onSubmit={onSubmit}>
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

          <div className="text-center text-muted">OR</div>

          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("Google signup failed. Please try again.");
              }}
            />
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
}