// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../services/api";

const AppContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("token"),
  user: null, // <-- We will store the full user object here
  isLoading: true,
  expenses: [],
  budgets: [],
  appError: null, // <-- Renamed 'error' to 'appError' for clarity
  theme: localStorage.getItem("theme") || "light",
};

function appReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        isLoading: false, // Stop loading, user will be fetched next
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...initialState,
        isLoading: false,
      };
    case "USER_LOADED": // <-- New case
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
      };
    case "AUTH_ERROR": // Fired on token fail or logout
      localStorage.removeItem("token");
      return {
        ...initialState,
        isLoading: false,
      };
    case "USER_UPDATE_SUCCESS": // <-- New case
      return {
        ...state,
        user: action.payload,
      };
    case "STOP_LOADING": // Fired if no token
      return {
        ...state,
        isLoading: false,
      };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "ADD_EXPENSE":
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp._id !== action.payload),
      };
    case "SET_THEME":
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
    case "SET_BUDGETS":
      return { ...state, budgets: action.payload };
    case "ADD_BUDGET":
      return { ...state, budgets: [action.payload, ...state.budgets] };
    case "DATA_ERROR": // General data error
      return { ...state, appError: action.payload };
    case "CLEAR_ERROR": // <-- New case
      return { ...state, appError: null };
    default:
      return state;
  }
}

// ... (initialState and appReducer are the same as before) ...

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // --- NEW: Wrap all functions in useCallback ---
useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', state.theme);
  }, [state.theme]);
  const loadUser = useCallback(async () => {
    if (localStorage.token) {
      try {
        const res = await api.get('/users/me');
        dispatch({ type: 'USER_LOADED', payload: res.data });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'STOP_LOADING' });
    }
  }, []); // Empty dependency array means this function never changes

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    await loadUser();
  }, [loadUser]); // Depends on loadUser

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    await loadUser();
  }, [loadUser]); // Depends on loadUser

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateUserDetails = useCallback(async (formData) => {
    try {
      const res = await api.put('/users/me', formData);
      dispatch({ type: 'USER_UPDATE_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      await api.put('/users/password', { oldPassword, newPassword });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
      throw err;
    }
  }, []);

  const getExpenses = useCallback(async () => {
    try {
      const res = await api.get('/expenses');
      dispatch({ type: 'SET_EXPENSES', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    }
  }, []);

  const addExpense = useCallback(async (expenseData) => {
    try {
      const res = await api.post('/expenses', expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      dispatch({ type: "DELETE_EXPENSE", payload: id });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
      console.error(err);
    }
  }, []);

  const getBudgets = useCallback(async () => {
    try {
      const res = await api.get('/budgets');
      dispatch({ type: 'SET_BUDGETS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    }
  }, []);

  const addBudget = useCallback(async (budgetData) => {
    try {
      const res = await api.post('/budgets', budgetData);
      dispatch({ type: 'ADD_BUDGET', payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
      throw err;
    }
  }, []);
const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME' });
  }, []);
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  // --- End of useCallback updates ---

  const value = {
    ...state,
    toggleTheme,
    register,
    login,
    logout,
    loadUser,
    updateUserDetails,
    changePassword,
    clearError,
    getExpenses,
    addExpense,
    deleteExpense,
    getBudgets,
    addBudget,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}