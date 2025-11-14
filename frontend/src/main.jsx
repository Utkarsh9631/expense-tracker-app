// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- Import
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import { AppProvider } from "./context/AppContext";

// Your Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "318992277950-sg7v3g89pouu665og6gve8a9l4ruohsk.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* --- Wrap your app --- */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);