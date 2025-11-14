// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Card, Row, Col, Button, Table, Nav, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getPeriodDateRange } from "../utils/dateHelpers"; // <-- IMPORT OUR NEW HELPER

export default function Dashboard() {
  const { 
    expenses, 
    budgets, 
    getExpenses, 
    getBudgets, 
    deleteExpense, 
    getCategories,
    processRecurringExpenses,
    isLoading // <-- Get isLoading state
  } = useAppContext();
  
  const navigate = useNavigate();

  // --- ADD STATE FOR THE ACTIVE PERIOD ---
  const [activePeriod, setActivePeriod] = useState("monthly");

  useEffect(() => {
    const loadData = async () => {
      // 1. Process subscriptions first. This might create new expenses.
      // We check for the function before calling it
      if (processRecurringExpenses) {
        await processRecurringExpenses();
      }
      
      // 2. NOW fetch all data, including the newly created expenses.
      getExpenses();
      getBudgets();
      getCategories();
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty array ensures this runs only ONCE

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // --- THIS IS THE NEW CORE LOGIC ---
  const periodData = useMemo(() => {
    const { start, end } = getPeriodDateRange(activePeriod);
    const activeBudgets = budgets.filter(b => b.period === activePeriod);
    const budgetedCategories = new Set(activeBudgets.map(b => b.category));
    const allExpensesInPeriod = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= start && expDate <= end;
    });
    const budgetedExpensesInPeriod = allExpensesInPeriod.filter(exp => 
      budgetedCategories.has(exp.category)
    );
    const totalBudget = activeBudgets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalExpenses = budgetedExpensesInPeriod.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const remaining = totalBudget - totalExpenses;

    return { totalBudget, totalExpenses, remaining, allExpensesInPeriod };

  }, [activePeriod, expenses, budgets]);
  // --- END OF NEW LOGIC ---

  if (isLoading && expenses.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
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

      <Nav
        variant="tabs"
        activeKey={activePeriod}
        onSelect={(k) => setActivePeriod(k)}
        className="mb-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="weekly">Weekly</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="monthly">Monthly</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="yearly">Yearly</Nav.Link>
        </Nav.Item>
      </Nav>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Budgeted Expenses ({activePeriod})</small>
              <h3 className="mb-0">${periodData.totalExpenses.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <small className="text-muted">Total Budget ({activePeriod})</small>
              <h3 className="mb-0">${periodData.totalBudget.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              {/* --- THIS IS THE FIX --- */}
              <small className="text-muted">Remaining ({activePeriod})</small>
              {/* --- END OF FIX --- */}
              <h3 className={`mb-0 ${periodData.remaining < 0 ? 'text-danger' : 'text-success'}`}>
                ${(periodData.remaining).toFixed(2)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Recent Expenses ({activePeriod})</h5>
          
          {periodData.allExpensesInPeriod.length === 0 ? (
            <p className="text-muted">No expenses recorded for this period.</p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {periodData.allExpensesInPeriod.slice(0, 10).map((exp) => (
                  <tr key={exp._id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td><span className="badge bg-secondary">{exp.category}</span></td>
                    <td>${exp.amount?.toFixed(2)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/edit-expense/${exp._id}`)}
                      >
                        Edit
                      </Button>
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