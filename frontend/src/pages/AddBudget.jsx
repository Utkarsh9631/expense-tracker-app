// src/pages/AddBudget.jsx
import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap"; // <-- Import Alert
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddBudget() {
  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    period: "monthly"
  });
  const [error, setError] = useState(""); // <-- Add error state
  const { addBudget } = useAppContext();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  // Make onSubmit async and add error handling
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors
    try {
      // This is now an API call
      await addBudget({
        ...form,
        amount: parseFloat(form.amount)
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to add budget. Please try again.");
    }
  };

  return (
    <Card className="mx-auto shadow-sm" style={{maxWidth: 600}}>
      <Card.Body>
        <h4 className="mb-4">Set Budget</h4>
        {error && <Alert variant="danger">{error}</Alert>} {/* <-- Add this line */}
        <Form onSubmit={onSubmit}>
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

          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>Budget Amount</Form.Label>
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

          <Form.Group className="mb-3" controlId="period">
            <Form.Label>Period</Form.Label>
            <Form.Select name="period" value={form.period} onChange={onChange}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Set Budget</Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}