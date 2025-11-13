// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    // --- THIS IS THE FIX ---
    // Removed the inline style: style={{background: "#fafafa"}}
    // Added Bootstrap's 'bg-body-tertiary' class, which is theme-aware
    <footer className="py-4 text-center text-muted mt-5 bg-body-tertiary">
      <div className="container">
        <small>© {new Date().getFullYear()} ExpensePro — Built with ♥</small>
      </div>
    </footer>
  );
}