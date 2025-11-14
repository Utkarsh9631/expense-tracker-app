// src/pages/AddBudget.jsx
import React, { useState, useEffect } from "react"; // <-- Import useEffect
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddBudget() {
  // --- UPDATED to include categories ---
  const { 
    addBudget, 
    categories, // <-- Get categories
    getCategories // <-- Get fetch function
  } = useAppContext();
  
  const [form, setForm] = useState({
    category: "", // <-- Set to empty
    amount: "",
    period: "monthly"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- ADDED: Fetch categories if needed ---
  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on load

  // --- UPDATED: Set default category from context ---
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0].name }));
    }
  }, [categories, form.category]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    try {
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

  // --- Define a default list in case categories are still loading ---
  const defaultCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];
  const categoryList = categories.length > 0 ? categories.map(c => c.name) : defaultCategories;

  return (
    <Card className="mx-auto shadow-sm" style={{maxWidth: 600}}>
      <Card.Body>
        <h4 className="mb-4">Set Budget</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          {/* --- UPDATED CATEGORY DROPDOWN --- */}
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={form.category} onChange={onChange} required>
              <option value="" disabled>-- Select a Category --</option>
              {categoryList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
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