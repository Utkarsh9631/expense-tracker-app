// src/pages/Analytics.jsx
import React, { useEffect, useMemo } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { useAppContext } from "../context/AppContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Analytics() {
  const { expenses, getExpenses, getBudgets, isLoading, theme } = useAppContext();

  useEffect(() => {
    if (expenses.length === 0) {
      getExpenses();
      getBudgets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- THEME CONFIGURATION ---
  const textColor = theme === 'dark' ? '#e0e0e0' : '#666666';
  const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // --- DATA PROCESSING ---
  const { categoryData, trendData, summaryStats } = useMemo(() => {
    if (!expenses.length) return { categoryData: null, trendData: null, summaryStats: null };

    // 1. Filter transactions
    const expenseTrans = expenses.filter((e) => e.type !== "income");
    const incomeTrans = expenses.filter((e) => e.type === "income");

    // 2. Summary Stats
    const totalSpent = expenseTrans.reduce((acc, curr) => acc + curr.amount, 0);
    const totalIncome = incomeTrans.reduce((acc, curr) => acc + curr.amount, 0);
    const summaryStats = {
      totalTransactions: expenses.length,
      totalSpent,
      totalIncome,
      avgTransaction: expenses.length > 0 ? (totalSpent / expenseTrans.length) || 0 : 0
    };

    // 3. Doughnut Chart Data
    const catTotals = expenseTrans.reduce((acc, curr) => {
      const cat = curr.category;
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});

    const doughnutData = {
      labels: Object.keys(catTotals),
      datasets: [
        {
          data: Object.values(catTotals),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#C9CBCF",
          ],
          borderColor: theme === 'dark' ? '#2b3035' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };

    // 4. Bar Chart Data
    const monthsMap = new Map();
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthsMap.set(key, { income: 0, expense: 0 });
    }

    expenses.forEach((exp) => {
      const d = new Date(exp.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (monthsMap.has(key)) {
        const current = monthsMap.get(key);
        if (exp.type === 'income') {
          current.income += exp.amount;
        } else {
          current.expense += exp.amount;
        }
      }
    });

    const barChartData = {
      labels: Array.from(monthsMap.keys()),
      datasets: [
        {
          label: 'Income',
          data: Array.from(monthsMap.values()).map(v => v.income),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
        {
          label: 'Expense',
          data: Array.from(monthsMap.values()).map(v => v.expense),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
      ],
    };

    return { categoryData: doughnutData, trendData: barChartData, summaryStats };
  }, [expenses, theme]);

  // --- CHART OPTIONS (Theme Aware) ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor }
      },
      title: { color: textColor }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor }
      }
    }
  };

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
      <h2 className="mb-4">Financial Analytics</h2>

      <Row className="g-4 mb-4">
        {/* --- Income vs Expense Trend --- */}
        <Col lg={8}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-4">Income vs Expense (Last 6 Months)</h5>
              {trendData ? (
                <div style={{ height: '300px' }}>
                  <Bar data={trendData} options={barOptions} />
                </div>
              ) : (
                <p className="text-muted text-center py-5">No data available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* --- Expense Breakdown --- */}
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5 className="mb-4">Expense Distribution</h5>
              {categoryData && categoryData.labels.length > 0 ? (
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                  <Doughnut 
                    data={categoryData} 
                    options={{
                      ...commonOptions,
                      plugins: {
                        legend: { position: 'bottom', labels: { color: textColor } }
                      }
                    }} 
                  />
                </div>
              ) : (
                <p className="text-muted text-center py-5">No expenses to display.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- RESTORED SUMMARY SECTION --- */}
      <Row className="g-3">
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-info">
            <Card.Body>
              <small className="text-muted">Total Transactions</small>
              <h4>{summaryStats ? summaryStats.totalTransactions : 0}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-warning">
            <Card.Body>
              <small className="text-muted">Total Spent (All Time)</small>
              <h4>${summaryStats ? summaryStats.totalSpent.toFixed(2) : "0.00"}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm border-start border-4 border-success">
            <Card.Body>
              <small className="text-muted">Avg Expense Transaction</small>
              <h4>${summaryStats ? summaryStats.avgTransaction.toFixed(2) : "0.00"}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}