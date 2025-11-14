// src/pages/AddExpense.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddExpense() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // --- UPDATED to include categories ---
  const { 
    addExpense, 
    updateExpense, 
    expenses, 
    getExpenses, 
    categories, // <-- Get categories
    getCategories // <-- Get fetch function
  } = useAppContext();
  
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "", // <-- Set to empty string
    date: new Date().toISOString().split('T')[0]
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
    // Set default category only if not in edit mode
    // and categories are loaded
    if (!isEditMode && categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0].name }));
    }
  }, [categories, isEditMode, form.category]);

  // This useEffect (for edit mode) is unchanged
  useEffect(() => {
    if (expenses.length === 0) {
      getExpenses(); 
    }
    if (isEditMode && expenses.length > 0) {
      const expenseToEdit = expenses.find((exp) => exp._id === id);
      if (expenseToEdit) {
        const formattedDate = new Date(expenseToEdit.date).toISOString().split('T')[0];
        setForm({
          description: expenseToEdit.description,
          amount: expenseToEdit.amount,
          category: expenseToEdit.category,
          date: formattedDate
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, expenses.length, getExpenses]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }
    
    const expenseData = {
      ...form,
      amount: parseFloat(form.amount)
    };

    try {
      if (isEditMode) {
        await updateExpense(id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(isEditMode ? "Failed to update expense." : "Failed to add expense.");
    }
  };

  // --- Define a default list in case categories are still loading ---
  const defaultCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];
  const categoryList = categories.length > 0 ? categories.map(c => c.name) : defaultCategories;

  return (
    <Card className="mx-auto shadow-sm" style={{maxWidth: 600}}>
      <Card.Body>
        <h4 className="mb-4">{isEditMode ? "Edit Expense" : "Add New Expense"}</h4>
        
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          {/* ... description and amount form groups ... */}
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
            <Button type="submit" variant="primary">
              {isEditMode ? "Save Changes" : "Add Expense"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}