// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="py-4 text-center text-muted mt-5" style={{background: "#fafafa"}}>
      <div className="container">
        <small>© {new Date().getFullYear()} ExpensePro — Built with ♥</small>
      </div>
    </footer>
  );
}
