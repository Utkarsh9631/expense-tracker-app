// src/pages/Analytics.jsx
import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";

export default function Analytics() {
  const { expenses } = useAppContext();

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

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
                          style={{width: `${(total / Object.values(categoryTotals).reduce((a,b) => a + b, 0)) * 100}%`}}
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
                <small className="text-muted">Average Transaction</small>
                <h4>${expenses.length > 0 ? (expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(2) : "0.00"}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
