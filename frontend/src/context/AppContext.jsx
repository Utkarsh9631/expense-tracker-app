// src/context/AppContext.jsx
import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../services/api";

const AppContext = createContext();

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem("token"),
  user: null,
  isLoading: true,
  expenses: [],
  budgets: [],
  categories: [],
  recurring: [],
  notifications: [], // <-- Added
  unreadCount: 0,    // <-- Added
  appError: null,
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
        isLoading: false,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
        isLoading: false,
      };
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
      };
    case "AUTH_ERROR":
      localStorage.removeItem("token");
      return {
        ...initialState,
        token: null,
        isLoading: false,
      };
    case "USER_UPDATE_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "STOP_LOADING":
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
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp._id === action.payload._id ? action.payload : exp
        ),
      };
    case "SET_THEME":
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
      
    // --- BUDGET CASES ---
    case "SET_BUDGETS":
      return { ...state, budgets: action.payload };
    case "ADD_BUDGET":
      return { ...state, budgets: [action.payload, ...state.budgets] };
    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((b) => b._id !== action.payload),
      };
    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "ADD_CATEGORY":
      return { ...state, categories: [action.payload, ...state.categories] };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat._id !== action.payload),
      };
      
    case "SET_RECURRING":
      return { ...state, recurring: action.payload };
    case "ADD_RECURRING":
      return { ...state, recurring: [action.payload, ...state.recurring] };
    case "DELETE_RECURRING":
      return {
        ...state,
        recurring: state.recurring.filter((r) => r._id !== action.payload),
      };

    // --- NOTIFICATION CASES (NEW) ---
    case "SET_NOTIFICATIONS": {
      const unread = action.payload.filter(n => !n.isRead).length;
      return { ...state, notifications: action.payload, unreadCount: unread };
    }
    case "MARK_READ": {
      const updatedNotifs = state.notifications.map(n => 
        n._id === action.payload ? { ...n, isRead: true } : n
      );
      return { 
        ...state, 
        notifications: updatedNotifs, 
        unreadCount: updatedNotifs.filter(n => !n.isRead).length 
      };
    }
    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [], unreadCount: 0 };

    case "DATA_ERROR":
      return { ...state, appError: action.payload };
    case "CLEAR_ERROR":
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
    await loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    await loadUser();
  }, [loadUser]);

  const loginWithGoogle = useCallback(async (googleToken) => {
    try {
      const res = await api.post('/auth/google-login', { token: googleToken });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      await loadUser();
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

  const getExpenses = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/expenses?${params}`);
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

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      const res = await api.put(`/expenses/${id}`, expenseData);
      dispatch({ type: "UPDATE_EXPENSE", payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
      throw err;
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

  const deleteBudget = useCallback(async (id) => {
    try {
      await api.delete(`/budgets/${id}`);
      dispatch({ type: "DELETE_BUDGET", payload: id });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    }
  }, []);

  const updateBudget = useCallback(async (id, budgetData) => {
    try {
      const res = await api.put(`/budgets/${id}`, budgetData);
      dispatch({ type: "UPDATE_BUDGET", payload: res.data });
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
      throw err;
    }
  }, []);

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
      const res = await api.post('/recurring/process');
      return res.data; 
    } catch (err) {
      dispatch({ type: 'DATA_ERROR', payload: err.response?.data?.msg });
    }
  }, []);

  // --- NOTIFICATION ACTIONS (NEW) ---
  const getNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      dispatch({ type: 'SET_NOTIFICATIONS', payload: res.data });
    } catch (err) {
      // Fail silently in background
      console.error("Failed to fetch notifications");
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      dispatch({ type: 'MARK_READ', payload: id });
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  const clearNotifications = useCallback(async () => {
    try {
      await api.delete('/notifications');
      dispatch({ type: 'CLEAR_NOTIFICATIONS' });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Poll for notifications every 60s
  useEffect(() => {
    if (state.isAuthenticated) {
      getNotifications();
      const interval = setInterval(getNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, getNotifications]);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'SET_THEME' });
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

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
    deleteBudget, 
    updateBudget, 
    getCategories,
    addCategory,
    deleteCategory,
    getRecurring,
    addRecurring,
    deleteRecurring,
    processRecurringExpenses,
    // New exports
    getNotifications,
    markAsRead,
    clearNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}