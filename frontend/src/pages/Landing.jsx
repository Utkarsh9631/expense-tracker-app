// src/pages/Landing.jsx
import React from "react";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
// --- MODIFIED: Import Link ---
import { Link } from "react-router-dom";

/**
 * Make sure the image files exist:
 * public/assets/landing-dashboard-preview.png
 * public/assets/avatar1.jpg
 * public/assets/avatar2.jpg
 */

function Hero() {
  return (
    <section id="about" className="landing-hero py-5">
      <Container>
        <Row className="align-items-center gy-4">
          <Col lg={6}>
            <small className="text-muted">Professional Expense Tracking</small>
            <h1 className="display-5 fw-bold mt-2">
              Track. Analyze. Grow Your Finances.
            </h1>
            <p className="lead text-muted">
              A professional expense tracker that helps you manage personal and
              business expenses effortlessly.
            </p>

            {/* --- MODIFIED: Buttons now link to pages --- */}
            <div className="d-flex gap-2 flex-wrap">
              <Button size="lg" variant="primary" as={Link} to="/signup">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline-success" as={Link} to="/login">
                <i className="bi bi-play-circle me-2"></i>View Demo
              </Button>
            </div>
            {/* --- END MODIFICATION --- */}

            <div className="trusted mt-3 d-flex align-items-center text-muted">
              <i className="bi bi-shield-check me-2"></i>
              <small>Trusted by 1,000+ users</small>
            </div>
          </Col>

          <Col lg={6}>
            <Card className="preview-card shadow-sm">
              <Card.Body
                className="p-4 d-flex align-items-center justify-content-center"
                style={{ minHeight: 240 }}
              >
                <img
                  src="/assets/landing-dashboard-preview.png"
                  alt="Dashboard preview"
                  className="img-fluid"
                />
              </Card.Body>
              {/* --- MODIFIED: Removed placeholder footer --- */}
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

function FeatureCard({ title, text, icon }) {
  return (
    <Card className="h-100 feature-card border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-start gap-3">
          <div className="feature-icon rounded-circle d-inline-flex align-items-center justify-content-center">
            <i className={`bi ${icon} fs-5`}></i>
          </div>
          <div>
            <h6 className="fw-semibold">{title}</h6>
            <p className="text-muted small mb-0">{text}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function Features() {
  // --- MODIFIED: Updated feature list to be accurate ---
  const features = [
    {
      title: "Smart Expense Tracking",
      text: "Quickly log expenses and assign them to custom categories.",
      icon: "bi-receipt",
    },
    {
      title: "Detailed Analytics",
      text: "Visualize spending trends and see exactly where your money goes.",
      icon: "bi-graph-up",
    },
    {
      title: "Custom Budgets",
      text: "Set weekly, monthly, or yearly budgets to avoid overspending.",
      icon: "bi-wallet2",
    },
    {
      title: "Subscription Management",
      text: "Track recurring bills and subscriptions so you never miss a payment.",
      icon: "bi-calendar-check",
    },
  ];
  // --- END MODIFICATION ---

  return (
    <section id="features" className="landing-features py-5">
      <Container>
        <h3 className="mb-4">Features built for modern finance</h3>
        <p className="text-muted mb-4">
          All the essentials you need, without the clutter.
        </p>

        <Row xs={1} md={2} lg={4} className="g-3">
          {features.map((f, i) => (
            <Col key={i}>
              <FeatureCard {...f} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

function HowItWorks() {
  // --- MODIFIED: Replaced placeholder steps with real ones and icons ---
  const steps = [
    {
      title: "Log Your Expenses",
      text: "Quickly add transactions and assign them to your custom categories.",
      icon: "bi-plus-circle-dotted",
    },
    {
      title: "Set Your Budgets",
      text: "Create monthly or yearly budgets to keep your spending in check.",
      icon: "bi-bullseye",
    },
    {
      title: "Get Insights",
      text: "See real-time analytics and reports on your spending habits.",
      icon: "bi-pie-chart",
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works py-5 bg-soft">
      <Container>
        <h4>How it works</h4>
        <p className="text-muted">From input to insight in three simple steps.</p>

        <Row className="g-3">
          {steps.map((s, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-start">
                    <Badge bg="light" text="dark" pill className="me-3 fs-6">
                      {idx + 1}
                    </Badge>
                    <div>
                      <h6 className="mb-1">{s.title}</h6>
                      <p className="text-muted small mb-3">{s.text}</p>
                      {/* --- MODIFIED: Replaced placeholder box with icon --- */}
                      <div className="text-center py-3">
                        <i
                          className={`${s.icon} display-4 text-primary opacity-50`}
                        ></i>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
// --- END MODIFICATION ---

function Testimonials() {
  return (
    <section id="testimonials" className="testimonials py-5">
      <Container>
        <h4 className="mb-3">Loved by entrepreneurs</h4>
        <p className="text-muted small">
          “It replaced spreadsheets and saved hours every week.”
        </p>

        {/* --- MODIFIED: Removed the placeholder "pill" column --- */}
        <Row className="g-3 align-items-center">
          <Col md={8}>
            <div className="d-flex gap-3">
              <Card
                className="p-3 shadow-sm"
                style={{ minWidth: 220, maxWidth: 300 }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img
                    src="/assets/avatar1.jpg"
                    alt="user"
                    className="rounded-circle"
                    width="48"
                    height="48"
                  />
                  <div>
                    <strong>Alex R.</strong>
                    <div className="small text-muted">Founder, Northlane</div>
                  </div>
                </div>
                <p className="mt-3 small text-muted mb-0">
                  ExpensePro gives us clarity on cash flow and spend in minutes.
                </p>
              </Card>

              <Card
                className="p-3 shadow-sm"
                style={{ minWidth: 220, maxWidth: 300 }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img
                    src="/assets/avatar2.jpg"
                    alt="user"
                    className="rounded-circle"
                    width="48"
                    height="48"
                  />
                  <div>
                    <strong>Priya K.</strong>
                    <div className="small text-muted">COO, Finch</div>
                  </div>
                </div>
                <p className="mt-3 small text-muted mb-0">
                  Clean, fast, and the analytics are spot on for board updates.
                </p>
              </Card>
            </div>
          </Col>
        </Row>
        {/* --- END MODIFICATION --- */}
      </Container>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="pricing py-5 bg-soft">
      <Container>
        <h4>Simple pricing that scales</h4>
        <p className="text-muted mb-4">
          Start free. Upgrade when you’re ready.
        </p>

        <Row className="g-3">
          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h6 className="mb-1">Free</h6>
              <h3 className="fw-bold">
                $0<span className="text-muted fs-6">/mo</span>
              </h3>
              <ul className="list-unstyled mt-3 mb-3 text-muted small">
                <li>✓ Unlimited Expense Tracking</li>
                <li>✓ Custom Categories</li>
                <li>✓ Basic Analytics</li>
              </ul>
              <Button
                variant="light"
                className="mt-auto"
                as={Link}
                to="/signup"
              >
                Choose Free
              </Button>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h6 className="mb-1">Pro</h6>
              <h3 className="fw-bold">
                $19<span className="text-muted fs-6">/mo</span>
              </h3>
              <ul className="list-unstyled mt-3 mb-3 text-muted small">
                <li>✓ Everything in Free</li>
                <li>✓ Advanced Analytics & Budgets</li>
                <li>✓ Subscription Management</li>
                <li>✓ Priority Support</li>
              </ul>
              <Button
                variant="primary"
                className="mt-auto"
                as={Link}
                to="/signup"
              >
                Start Pro Trial
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
    </>
  );
}