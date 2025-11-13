// src/pages/Analytics.jsx
import React, { useEffect } from "react"; // <-- Import useEffect
import { Card, Row, Col, Spinner } from "react-bootstrap"; // <-- Import Spinner
import { useAppContext } from "../context/AppContext";

export default function Analytics() {
  // <-- Get isLoading and the fetch functions
  const { expenses, getExpenses, getBudgets, isLoading } = useAppContext();

  // --- ADD THIS useEffect ---
  // This tells React to fetch data from the API when the page loads
  useEffect(() => {
    // Only fetch if data isn't already there (or if loading)
    // This check is optional but good practice
    if (expenses.length === 0) {
      getExpenses();
      getBudgets(); // Good to get all data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty array [] means this runs only once on mount

  // Calculate totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Show a loading spinner if data is fetching
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
      <h2 className="mb-4">Analytics</h2>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Spending by Category</h5>
              {Object.keys(categoryTotals).length === 0 ? (
                <p className="text-muted">No data available yet.</p>
              ) : (
                <div>
                  {Object.entries(categoryTotals).map(([cat, total]) => (
                    <div key={cat} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{cat}</span>
                        <strong>${total.toFixed(2)}</strong>
                      </div>
                      <div className="progress" style={{height: 8}}>
                        <div 
                          className="progress-bar" 
                          role="progressbar"
                          style={{width: `${(total / totalSpent) * 100}%`}}
                          aria-valuenow={(total / totalSpent) * 100}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Summary</h5>
              <div className="mb-3">
                <small className="text-muted">Total Transactions</small>
                <h4>{expenses.length}</h4>
              </div>
              <div className="mb-3">
                <small className="text-muted">Total Spent</small>
                <h4>${totalSpent.toFixed(2)}</h4>
              </div>
              <div className="mb-3">
                <small className="text-muted">Average Transaction</small>
                <h4>${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : "0.00"}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}