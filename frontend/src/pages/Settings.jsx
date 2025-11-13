// src/pages/Settings.jsx
import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

export default function Settings() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    currency: "USD",
    notifications: true
  });

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Settings saved!");
  };

  return (
    <div>
      <h2 className="mb-4">Settings</h2>

      <Card className="shadow-sm" style={{maxWidth: 600}}>
        <Card.Body>
          <h5 className="mb-3">Profile Settings</h5>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="your@email.com"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="currency">
              <Form.Label>Currency</Form.Label>
              <Form.Select name="currency" value={form.currency} onChange={onChange}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="notifications">
              <Form.Check
                type="checkbox"
                name="notifications"
                label="Enable email notifications"
                checked={form.notifications}
                onChange={onChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">Save Settings</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
