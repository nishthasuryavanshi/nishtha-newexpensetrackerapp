
// new code for react app from here modified code:-

import React, { useState, useEffect, useReducer } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { expenseReducer, initialState } from './utils/expenseReducer';
import { NotificationProvider, useNotifications } from './utils/NotificationContext';
import './App.css';

function AppContent() {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const { showNotification } = useNotifications();

  // Load saved data
  useEffect(() => {
    try {
      const savedExpenses = localStorage.getItem('expenses');
      const savedBudget = localStorage.getItem('budget');
      const savedCategories = localStorage.getItem('categories');
      const savedDarkMode = localStorage.getItem('darkMode');

      if (savedExpenses) dispatch({ type: 'LOAD_EXPENSES', payload: JSON.parse(savedExpenses) });
      if (savedBudget) dispatch({ type: 'SET_BUDGET', payload: parseFloat(savedBudget) });
      if (savedCategories) dispatch({ type: 'LOAD_CATEGORIES', payload: JSON.parse(savedCategories) });
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    } catch (error) {
      showNotification('Error loading saved data', 'error');
    }
  }, [showNotification]);

  // Save updates
  useEffect(() => {
    try {
      localStorage.setItem('expenses', JSON.stringify(state.expenses));
      localStorage.setItem('budget', state.budget.toString());
      localStorage.setItem('categories', JSON.stringify(state.categories));
    } catch (error) {
      showNotification('Error saving data', 'error');
    }
  }, [state.expenses, state.budget, state.categories, showNotification]);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Handlers
  const handleAddExpense = (expense) => {
    try {
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
      showNotification('Expense added successfully!', 'success');
    } catch {
      showNotification('Failed to add expense', 'error');
    }
  };

  const handleDeleteExpense = (id) => {
    try {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      showNotification('Expense deleted successfully!', 'success');
    } catch {
      showNotification('Failed to delete expense', 'error');
    }
  };

  const handleEditExpense = (id, updatedExpense) => {
    try {
      dispatch({ type: 'EDIT_EXPENSE', payload: { id, updatedExpense } });
      showNotification('Expense updated successfully!', 'success');
    } catch {
      showNotification('Failed to update expense', 'error');
    }
  };

  const handleSetBudget = (budget) => {
    try {
      dispatch({ type: 'SET_BUDGET', payload: budget });
      showNotification('Budget updated successfully!', 'success');
    } catch {
      showNotification('Failed to update budget', 'error');
    }
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard expenses={state.expenses} budget={state.budget} />;
      case 'add-expense':
        return <ExpenseForm onAddExpense={handleAddExpense} categories={state.categories} />;
      case 'expenses':
        return (
          <ExpenseList
            expenses={state.expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
            categories={state.categories}
          />
        );
      case 'analytics':
        return <Analytics expenses={state.expenses} budget={state.budget} />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return (
          <Settings
            budget={state.budget}
            onSetBudget={handleSetBudget}
            categories={state.categories}
            onUpdateCategories={(categories) =>
              dispatch({ type: 'UPDATE_CATEGORIES', payload: categories })
            }
            darkMode={darkMode}
            onToggleDarkMode={setDarkMode}
          />
        );
      default:
        return <Dashboard expenses={state.expenses} budget={state.budget} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`} style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={true} onClose={() => {}} />

      {/* Main content */}
      <div className="main-content" style={{ flex: 1, marginLeft: '160px' }}>
        <Header
          darkMode={darkMode}
          onToggleDarkMode={setDarkMode}
          onMenuClick={() => {}}
        />
        <main className="app-content">{renderActiveComponent()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;

