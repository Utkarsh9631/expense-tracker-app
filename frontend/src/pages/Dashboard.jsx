// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Dashboard() {
  // Get expenses, budgets AND the functions to fetch/delete
  const { expenses, budgets, getExpenses, getBudgets, deleteExpense } = useAppContext(); // <-- Add deleteExpense
  const navigate = useNavigate();

  useEffect(() => {
    getExpenses();
    getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Add this handler ---
  const handleDelete = async (id) => {
    // We will replace window.confirm later
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => navigate("/add-expense")}>
            + Add Expense
          </Button>
          <Button variant="outline-primary" onClick={() => navigate("/add-budget")}>
            Set Budget
          </Button>
        </div>
      </div>

      {/* ... Card components ... */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Total Expenses</small>
              <h3 className="mb-0">${totalExpenses.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Total Budget</small>
              <h3 className="mb-0">${totalBudget.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Remaining</small>
              <h3 className={`mb-0 ${totalBudget - totalExpenses < 0 ? 'text-danger' : 'text-success'}`}>
                ${(totalBudget - totalExpenses).toFixed(2)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Recent Expenses</h5>
          {expenses.length === 0 ? (
            <p className="text-muted">No expenses yet. Add your first expense to get started.</p>
          ) : (
            <Table hover responsive>
              {/* --- THIS IS THE FIX --- */}
              {/* Removed comments from inside <tr> */}
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* --- END OF FIX --- */}
              <tbody>
                {expenses.slice(0, 10).map((exp) => (
                  <tr key={exp._id}> 
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td><span className="badge bg-secondary">{exp.category}</span></td>
                    <td>${exp.amount?.toFixed(2)}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => handleDelete(exp._id)}
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