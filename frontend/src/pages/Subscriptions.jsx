// src/pages/Subscriptions.jsx
import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Row, Col, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Subscriptions() {
  const { 
    categories, 
    getCategories, 
    recurring, 
    getRecurring, 
    addRecurring, 
    deleteRecurring,
    appError,
    clearError
  } = useAppContext();
  
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split('T')[0]
  });

  // Fetch data on load
  useEffect(() => {
    if (categories.length === 0) getCategories();
    if (recurring.length === 0) getRecurring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !form.category) {
      setForm(f => ({ ...f, category: categories[0].name }));
    }
  }, [categories, form.category]);
  
  // Clear errors on unmount
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    clearError();
    if (!form.category) {
      setError("Please select a category.");
      return;
    }
    try {
      await addRecurring({
        ...form,
        amount: parseFloat(form.amount)
      });
      // Reset form
      setForm({
        description: "",
        amount: "",
        category: categories[0]?.name || "",
        frequency: "monthly",
        startDate: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(appError || "Failed to add subscription.");
    }
  };
  
  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete subscription "${name}"? This cannot be undone.`)) {
      await deleteRecurring(id);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  const categoryList = categories.length > 0 ? categories.map(c => c.name) : [];

  return (
    <Row className="g-4">
      {/* --- ADD NEW SUBSCRIPTION --- */}
      <Col lg={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <h4 className="mb-4">Add Subscription</h4>
            {error && <Alert variant="danger">{error}</Alert>}
            {appError && !error && <Alert variant="danger">{appError}</Alert>}
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="e.g., Netflix, Rent"
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
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {/* Show default if categories haven't loaded, just in case */}
                  {categoryList.length === 0 && <option value="Other">Other</option>}
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="frequency">
                <Form.Label>Frequency</Form.Label>
                <Form.Select name="frequency" value={form.frequency} onChange={onChange} required>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>First Bill Date</Form.Label>
                <Form.Control
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={onChange}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">Add Subscription</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      {/* --- VIEW SUBSCRIPTIONS --- */}
      <Col lg={8}>
        <h2 className="mb-4">My Subscriptions</h2>
        <Card className="shadow-sm">
          <Card.Body>
            {recurring.length === 0 ? (
              <p className="text-muted">No subscriptions added yet.</p>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Frequency</th>
                    <th>Next Bill</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recurring.map((sub) => {
                    let nextBill = new Date(sub.lastProcessedDate || sub.startDate);
                    if (sub.lastProcessedDate) {
                      if (sub.frequency === 'monthly') nextBill.setMonth(nextBill.getMonth() + 1);
                      if (sub.frequency === 'yearly') nextBill.setFullYear(nextBill.getFullYear() + 1);
                    }
                    
                    return (
                      <tr key={sub._id}>
                        <td>{sub.description}</td>
                        <td>${sub.amount.toFixed(2)}</td>
                        <td><Badge bg="secondary">{sub.category}</Badge></td>
                        <td>{sub.frequency.charAt(0).toUpperCase() + sub.frequency.slice(1)}</td>
                        <td>{formatDate(nextBill)}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(sub._id, sub.description)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}