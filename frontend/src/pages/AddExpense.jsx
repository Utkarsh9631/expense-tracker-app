// src/pages/AddExpense.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap"; // Import Alert
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddExpense() {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(""); // Add error state
  const { addExpense } = useAppContext();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  // Make onSubmit async
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors
    try {
      // This is now an API call
      await addExpense({
        ...form,
        amount: parseFloat(form.amount)
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to add expense. Please try again.");
    }
  };

  return (
    <Card className="mx-auto shadow-sm" style={{maxWidth: 600}}>
      <Card.Body>
        <h4 className="mb-4">Add New Expense</h4>
        {error && <Alert variant="danger">{error}</Alert>} {/* Show error */}
        <Form onSubmit={onSubmit}>
          {/* ... all your form groups ... */}
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="e.g., Office supplies"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={onChange}
              placeholder="0.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={form.category} onChange={onChange}>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              name="date"
              type="date"
              value={form.date}
              onChange={onChange}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Add Expense</Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}