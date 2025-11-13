// src/pages/Dashboard.jsx
import React, { useEffect } from "react"; // Import useEffect
import { Card, Row, Col, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Dashboard() {
  // Get expenses, budgets AND the functions to fetch them
  const { expenses, budgets, getExpenses, getBudgets } = useAppContext();
  const navigate = useNavigate();

  // --- ADD THIS useEffect ---
  // This tells React to fetch data from the API when the page loads
  useEffect(() => {
    getExpenses();
    getBudgets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty array [] means this runs only once on mount

  // Your existing calculations will now work with API data
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // Format date nicely (optional, but good)
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

      <Row className="g-3 mb-4">
        {/* ... Card components ... */}
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
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* Use the MongoDB _id for the key */}
                {expenses.slice(0, 10).map((exp) => (
                  <tr key={exp._id}> 
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td><span className="badge bg-secondary">{exp.category}</span></td>
                    <td>${exp.amount?.toFixed(2)}</td>
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