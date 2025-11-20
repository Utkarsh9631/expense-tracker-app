// src/pages/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Card, Row, Col, Button, Table, Nav, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { getPeriodDateRange } from "../utils/dateHelpers";

export default function Dashboard() {
  const { 
    expenses, 
    budgets, 
    getExpenses, 
    getBudgets, 
    deleteExpense, 
    getCategories,
    processRecurringExpenses,
    isLoading 
  } = useAppContext();
  
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState("monthly");

  useEffect(() => {
    const loadData = async () => {
      if (processRecurringExpenses) {
        await processRecurringExpenses();
      }
      getExpenses();
      getBudgets();
      getCategories();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      await deleteExpense(id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const periodData = useMemo(() => {
    const { start, end } = getPeriodDateRange(activePeriod);
    
    // 1. Filter expenses by date range
    const allTransactionsInPeriod = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= start && expDate <= end;
    });

    // 2. Separate Income and Expenses
    const incomeTransactions = allTransactionsInPeriod.filter(t => t.type === 'income');
    const expenseTransactions = allTransactionsInPeriod.filter(t => t.type !== 'income');

    // 3. Calculate Income/Expense Totals
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const netBalance = totalIncome - totalExpenses;

    // 4. --- NEW BUDGET LOGIC ---
    const activeBudgets = budgets.filter(b => b.period === activePeriod);
    
    // Check if we have an "Overall" budget
    const overallBudget = activeBudgets.find(b => b.category === 'Overall');
    const totalBudget = activeBudgets.reduce((sum, b) => sum + (b.amount || 0), 0);

    let budgetedExpensesTotal = 0;

    if (overallBudget) {
      // If "Overall" budget exists, ALL expenses count towards usage
      budgetedExpensesTotal = totalExpenses; 
    } else {
      // Otherwise, only sum expenses that have a matching category budget
      const budgetedCategories = new Set(activeBudgets.map(b => b.category));
      const budgetedExpenses = expenseTransactions.filter(exp => 
        budgetedCategories.has(exp.category)
      );
      budgetedExpensesTotal = budgetedExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    }

    const remaining = totalBudget - budgetedExpensesTotal;

    return { 
      totalIncome, 
      totalExpenses, 
      netBalance, 
      totalBudget,
      remaining,
      budgetedExpensesTotal, // Useful for display
      allExpensesInPeriod: allTransactionsInPeriod 
    };

  }, [activePeriod, expenses, budgets]);

  if (isLoading && expenses.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2>Dashboard</h2>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={() => navigate("/add-expense")}>+ Add Transaction</Button>
          <Button variant="outline-primary" onClick={() => navigate("/add-budget")}>Set Budget</Button>
        </div>
      </div>

      <Nav variant="tabs" activeKey={activePeriod} onSelect={(k) => setActivePeriod(k)} className="mb-3">
        <Nav.Item><Nav.Link eventKey="weekly">Weekly</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="monthly">Monthly</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link eventKey="yearly">Yearly</Nav.Link></Nav.Item>
      </Nav>

      {/* Income / Expense / Balance Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-success">
            <Card.Body>
              <small className="text-muted">Total Income ({activePeriod})</small>
              <h3 className="mb-0 text-success">${periodData.totalIncome.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-danger">
            <Card.Body>
              <small className="text-muted">Total Expenses ({activePeriod})</small>
              <h3 className="mb-0 text-danger">${periodData.totalExpenses.toFixed(2)}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-primary">
            <Card.Body>
              <small className="text-muted">Net Balance ({activePeriod})</small>
              <h3 className={`mb-0 ${periodData.netBalance >= 0 ? 'text-primary' : 'text-danger'}`}>
                ${periodData.netBalance.toFixed(2)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget Overview */}
      <Row className="g-3 mb-4">
        <Col md={6}>
           <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Total Budget</small>
                  <h3 className="mb-0">${periodData.totalBudget.toFixed(2)}</h3>
                </div>
                 <div className="text-end">
                  <small className="text-muted">Remaining</small>
                  <h3 className={`mb-0 ${periodData.remaining < 0 ? 'text-danger' : 'text-success'}`}>
                    ${periodData.remaining.toFixed(2)}
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center p-3">
            <span className="text-muted">
              {periodData.totalBudget > 0 
                ? `You have spent $${periodData.budgetedExpensesTotal.toFixed(2)} of your budgeted funds.` 
                : "No budget set for this period."}
            </span>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Recent Transactions ({activePeriod})</h5>
          {periodData.allExpensesInPeriod.length === 0 ? (
            <p className="text-muted">No transactions recorded for this period.</p>
          ) : (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {periodData.allExpensesInPeriod.slice(0, 10).map((exp) => (
                  <tr key={exp._id}>
                    <td>{formatDate(exp.date)}</td>
                    <td>{exp.description}</td>
                    <td><Badge bg="secondary">{exp.category}</Badge></td>
                    <td>
                      <Badge bg={exp.type === 'income' ? 'success' : 'danger'}>
                        {exp.type === 'income' ? 'Income' : 'Expense'}
                      </Badge>
                    </td>
                    <td className={exp.type === 'income' ? 'text-success fw-bold' : ''}>
                      {exp.type === 'income' ? '+' : '-'}${exp.amount?.toFixed(2)}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => navigate(`/edit-expense/${exp._id}`)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(exp._id)}>Delete</Button>
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