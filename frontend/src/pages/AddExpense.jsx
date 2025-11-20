// src/pages/AddExpense.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, ButtonGroup, ToggleButton } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddExpense() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const { 
    addExpense, 
    updateExpense, 
    expenses, 
    getExpenses, 
    categories, 
    getCategories 
  } = useAppContext();
  
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "", 
    date: new Date().toISOString().split('T')[0],
    type: "expense" 
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- LISTS OF CATEGORIES ---
  const incomeCategories = ["Salary", "Freelance", "Investments", "Rental Income", "Gift", "Refund", "Other"];
  const expenseDefaultCategories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Rent", "Health", "Other"];
  
  // Combine default expense cats with user custom cats
  const expenseCategories = [...new Set([...expenseDefaultCategories, ...categories.map(c => c.name)])];

  // Determine which list to show based on form type
  const activeCategoryList = form.type === 'income' ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (categories.length === 0) getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // --- UPDATED: Auto-select first category when type changes ---
  useEffect(() => {
    if (!isEditMode) {
      // If the current category isn't in the active list, reset it to the first one
      if (!activeCategoryList.includes(form.category)) {
        setForm(f => ({ ...f, category: activeCategoryList[0] }));
      }
    }
  }, [form.type, activeCategoryList, isEditMode, form.category]);

  useEffect(() => {
    if (expenses.length === 0) getExpenses(); 
    
    if (isEditMode && expenses.length > 0) {
      const expenseToEdit = expenses.find((exp) => exp._id === id);
      if (expenseToEdit) {
        const formattedDate = new Date(expenseToEdit.date).toISOString().split('T')[0];
        setForm({
          description: expenseToEdit.description,
          amount: expenseToEdit.amount,
          category: expenseToEdit.category,
          date: formattedDate,
          type: expenseToEdit.type || "expense"
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode, expenses.length, getExpenses]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const expenseData = { ...form, amount: parseFloat(form.amount) };

    try {
      if (isEditMode) {
        await updateExpense(id, expenseData);
      } else {
        await addExpense(expenseData);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(isEditMode ? "Failed to update transaction." : "Failed to add transaction.");
    }
  };

  return (
    <Card className="mx-auto shadow-sm" style={{maxWidth: 600}}>
      <Card.Body>
        <h4 className="mb-4">{isEditMode ? "Edit Transaction" : "Add Transaction"}</h4>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          
          <Form.Group className="mb-3 text-center">
            <ButtonGroup>
              <ToggleButton
                id="radio-expense"
                type="radio"
                variant={form.type === 'expense' ? 'danger' : 'outline-danger'}
                name="type"
                value="expense"
                checked={form.type === 'expense'}
                onChange={(e) => setForm({ ...form, type: e.currentTarget.value })}
              >
                Expense
              </ToggleButton>
              <ToggleButton
                id="radio-income"
                type="radio"
                variant={form.type === 'income' ? 'success' : 'outline-success'}
                name="type"
                value="income"
                checked={form.type === 'income'}
                onChange={(e) => setForm({ ...form, type: e.currentTarget.value })}
              >
                Income
              </ToggleButton>
            </ButtonGroup>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder={form.type === 'income' ? "e.g. October Salary" : "e.g. Office supplies"}
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
            <Form.Select name="category" value={form.category} onChange={onChange} required>
              <option value="" disabled>-- Select a Category --</option>
              {activeCategoryList.map((cat) => (
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
              {isEditMode ? "Save Changes" : "Add Transaction"}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Cancel</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}