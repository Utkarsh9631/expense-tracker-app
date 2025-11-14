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
  categories: [],
  recurring: [],
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
        token: null, // Ensure token is cleared from state
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
        token: null, // Ensure token is cleared from state
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
    // --- ADD THIS CASE ---
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp._id === action.payload._id ? action.payload : exp
        ),
      };
    // --- END OF ADDED CASE ---
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

    // --- ADD THESE CASES ---
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [action.payload, ...state.categories] };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat._id !== action.payload),
      };
    // --- END OF ADDED CASES ---
      
      // --- ADD THESE CASES ---
    case "SET_RECURRING":
      return { ...state, recurring: action.payload };
    case "ADD_RECURRING":
      return { ...state, recurring: [action.payload, ...state.recurring] };
    case "DELETE_RECURRING":
      return {
        ...state,
        recurring: state.recurring.filter((r) => r._id !== action.payload),
      };
    // --- END OF ADDED CASES ---

    case "DATA_ERROR": // General data error
      return { ...state, appError: action.payload };
    case "CLEAR_ERROR": // <-- New case
      return { ...state, appError: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
 
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
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    await loadUser(); // <-- This line fetches user data
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    await loadUser(); // <-- This line fetches user data
  }, [loadUser]);

  const loginWithGoogle = useCallback(async (googleToken) => {
    try {
      const res = await api.post('/auth/google-login', { token: googleToken });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      await loadUser(); // <-- This line fetches user data
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response.data.msg });
      throw err; 
    }
  }, [loadUser]);

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

  // --- ADD THIS FUNCTION ---
const updateExpense = useCallback(async (id, expenseData) => {
  try {
    const res = await api.put(`/expenses/${id}`, expenseData);
    dispatch({ type: "UPDATE_EXPENSE", payload: res.data });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    throw err; // Re-throw so the form can catch it
  }
}, []);
// --- END OF ADDED FUNCTION ---

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

  // --- ADD THESE FUNCTIONS ---
const getCategories = useCallback(async () => {
  try {
    const res = await api.get('/categories');
    dispatch({ type: 'SET_CATEGORIES', payload: res.data });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
  }
}, []);

const addCategory = useCallback(async (name) => {
  try {
    const res = await api.post('/categories', { name });
    dispatch({ type: 'ADD_CATEGORY', payload: res.data });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    throw err;
  }
}, []);

const deleteCategory = useCallback(async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    throw err;
  }
}, []);
// --- END OF ADDED FUNCTIONS ---

  // --- ADD THESE FUNCTIONS ---
const getRecurring = useCallback(async () => {
  try {
    const res = await api.get('/recurring');
    dispatch({ type: 'SET_RECURRING', payload: res.data });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
  }
}, []);

const addRecurring = useCallback(async (data) => {
  try {
    const res = await api.post('/recurring', data);
    dispatch({ type: 'ADD_RECURRING', payload: res.data });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    throw err;
  }
}, []);

const deleteRecurring = useCallback(async (id) => {
  try {
    await api.delete(`/recurring/${id}`);
    dispatch({ type: 'DELETE_RECURRING', payload: id });
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    throw err;
  }
}, []);

const processRecurringExpenses = useCallback(async () => {
  try {
    // This just tells the backend to work its magic
    const res = await api.post('/recurring/process');
    return res.data; // Returns { msg: '...', expensesCreated: N }
  } catch (err) {
    dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
  }
}, []);
// --- END OF ADDED FUNCTIONS ---

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME' });
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  // --- This 'value' object is now complete and correct ---
  const value = {
    ...state,
    toggleTheme,
    register,
    login,
    loginWithGoogle,
    logout,
    loadUser,
    updateUserDetails,
    changePassword,
    clearError,
    getExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
    getBudgets,
    addBudget,
    getCategories,
    addCategory,
    deleteCategory,
    getRecurring,
    addRecurring,
    deleteRecurring,
    processRecurringExpenses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}