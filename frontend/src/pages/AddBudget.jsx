// src/pages/AddBudget.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function AddBudget() {
  const { 
    budgets,
    getBudgets,
    addBudget, 
    updateBudget, 
    deleteBudget,
    categories, 
    getCategories 
  } = useAppContext();
  
  // Track if we are editing a budget
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    category: "",
    amount: "",
    period: "monthly"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data if missing
    if (categories.length === 0) getCategories();
    if (budgets.length === 0) getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default category (Overall)
  useEffect(() => {
    if (!editingId && !form.category) {
      setForm(f => ({ ...f, category: "Overall" }));
    }
  }, [categories, form.category, editingId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    const budgetData = {
      ...form,
      amount: parseFloat(form.amount)
    };

    try {
      if (editingId) {
        // Update existing
        await updateBudget(editingId, budgetData);
        setEditingId(null); // Exit edit mode
      } else {
        // Add new
        await addBudget(budgetData);
      }
      // Reset form
      setForm({ category: "Overall", amount: "", period: "monthly" });
    } catch (err) {
      console.error(err);
      setError(editingId ? "Failed to update budget." : "Failed to add budget.");
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setForm({
      category: budget.category,
      amount: budget.amount,
      period: budget.period
    });
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      await deleteBudget(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ category: "Overall", amount: "", period: "monthly" });
  };

  const defaultCategories = ["Overall", "Food", "Transport", "Entertainment", "Utilities", "Shopping", "Other"];
  const categoryList = [...new Set(["Overall", ...categories.map(c => c.name), ...defaultCategories])];

  return (
    <div style={{maxWidth: 800}} className="mx-auto">
      {/* --- FORM SECTION --- */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4 className="mb-4">{editingId ? "Edit Budget" : "Set Budget"}</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={onChange} required>
                <option value="" disabled>-- Select a Category --</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Select "Overall" to create a master budget for all expenses.
              </Form.Text>
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
              <Button type="submit" variant={editingId ? "warning" : "primary"}>
                {editingId ? "Update Budget" : "Set Budget"}
              </Button>
              {editingId && (
                <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
              )}
              {!editingId && (
                <Button variant="outline-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* --- LIST SECTION --- */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Your Budgets</h5>
          {budgets.length === 0 ? (
            <p className="text-muted">No budgets set yet.</p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget._id}>
                    <td>
                      <Badge bg={budget.category === 'Overall' ? 'primary' : 'secondary'}>
                        {budget.category}
                      </Badge>
                    </td>
                    <td>${budget.amount.toFixed(2)}</td>
                    <td>{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(budget)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(budget._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}