// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api"; // Make sure api.js is set up with interceptors

const AppContext = createContext();

// Define initial state
const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("token"),
  user: null,
  isLoading: true,
  expenses: [],
  budgets: [],
  error: null, // Add an error field
};

// Define a reducer to manage state changes
function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        isLoading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...initialState, // Reset to initial state
        isLoading: false,
      };
    case "LOAD_USER":
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        isLoading: false,
      };
    case "AUTH_ERROR":
    case "STOP_LOADING":
      return {
        ...state,
        isLoading: false,
      };
    
    // --- NEW DATA CASES ---
    case "SET_EXPENSES":
      return {
        ...state,
        expenses: action.payload,
      };
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [action.payload, ...state.expenses], // Add new one to the front
      };
    case "SET_BUDGETS":
      return {
        ...state,
        budgets: action.payload,
      };
    case "ADD_BUDGET":
      return {
        ...state,
        budgets: [action.payload, ...state.budgets],
      };
    case "DATA_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    
    // You can keep DELETE_EXPENSE or handle it via API
    case "DELETE_EXPENSE":
      return {
        ...state,
        // This is local only, better to make an API call
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create the provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: "LOAD_USER", payload: { token } });
    } else {
      dispatch({ type: "STOP_LOADING" });
    }
  }, []);

  // --- Auth Actions (from before) ---
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  };
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

// --- NEW: Data Actions ---
  const getExpenses = async () => {
    try {
      // REMOVED /api from the path
      const res = await api.get('/expenses'); 
      dispatch({ type: 'SET_EXPENSES', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
    }
  };

  const addExpense = async (expenseData) => {
    try {
      // REMOVED /api from the path
      const res = await api.post('/expenses', expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
      throw err; // Re-throw error so the form can catch it
    }
  };

  const getBudgets = async () => {
    try {
      // REMOVED /api from the path
      const res = await api.get('/budgets');
      dispatch({ type: 'SET_BUDGETS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
    }
  };
  
  const addBudget = async (budgetData) => {
    try {
      // REMOVED /api from the path
      const res = await api.post('/budgets', budgetData);
      dispatch({ type: 'ADD_BUDGET', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
      throw err; // Re-throw error
    }
  };

  const deleteExpense = (id) => {
    // TODO: Make this an API call: api.delete(`/api/expenses/${id}`)
    dispatch({ type: "DELETE_EXPENSE", payload: id });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    getExpenses, // Expose new function
    addExpense,  // Expose updated function
    getBudgets,  // Expose new function
    addBudget,   // Expose updated function
    deleteExpense
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}