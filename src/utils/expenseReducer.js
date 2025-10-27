// Initial state for the expense tracker
export const initialState = {
  expenses: [],
  budget: 5000,
  categories: [
    { id: '1', name: 'Food & Dining', color: '#ef4444', icon: '🍽️' },
    { id: '2', name: 'Transportation', color: '#3b82f6', icon: '🚗' },
    { id: '3', name: 'Entertainment', color: '#8b5cf6', icon: '🎬' },
    { id: '4', name: 'Shopping', color: '#f59e0b', icon: '🛍️' },
    { id: '5', name: 'Health & Fitness', color: '#10b981', icon: '💪' },
    { id: '6', name: 'Bills & Utilities', color: '#6b7280', icon: '⚡' },
    { id: '7', name: 'Travel', color: '#06b6d4', icon: '✈️' },
    { id: '8', name: 'Education', color: '#84cc16', icon: '📚' },
    { id: '9', name: 'Investment', color: '#f97316', icon: '📈' },
    { id: '10', name: 'Others', color: '#64748b', icon: '🏷️' }
  ]
};

// Action types
export const ACTION_TYPES = {
  ADD_EXPENSE: 'ADD_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  EDIT_EXPENSE: 'EDIT_EXPENSE',
  LOAD_EXPENSES: 'LOAD_EXPENSES',
  SET_BUDGET: 'SET_BUDGET',
  UPDATE_CATEGORIES: 'UPDATE_CATEGORIES',
  LOAD_CATEGORIES: 'LOAD_CATEGORIES',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA'
};

// Utility functions
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const validateExpense = (expense) => {
  const errors = [];
  
  if (!expense.amount || expense.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!expense.description || expense.description.trim() === '') {
    errors.push('Description is required');
  }
  
  if (!expense.category) {
    errors.push('Category is required');
  }
  
  if (!expense.date) {
    errors.push('Date is required');
  }
  
  return errors;
};

// Reducer function
export const expenseReducer = (state, action) => {
  try {
    switch (action.type) {
      case ACTION_TYPES.ADD_EXPENSE: {
        const expense = action.payload;
        
        // Validate expense
        const errors = validateExpense(expense);
        if (errors.length > 0) {
          throw new Error(`Invalid expense data: ${errors.join(', ')}`);
        }

        const newExpense = {
          ...expense,
          id: generateId(),
          amount: parseFloat(expense.amount),
          date: new Date(expense.date).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return {
          ...state,
          expenses: [newExpense, ...state.expenses]
        };
      }

      case ACTION_TYPES.DELETE_EXPENSE: {
        const expenseId = action.payload;
        
        return {
          ...state,
          expenses: state.expenses.filter(expense => expense.id !== expenseId)
        };
      }

      case ACTION_TYPES.EDIT_EXPENSE: {
        const { id, updatedExpense } = action.payload;
        
        // Validate updated expense
        const errors = validateExpense(updatedExpense);
        if (errors.length > 0) {
          throw new Error(`Invalid expense data: ${errors.join(', ')}`);
        }

        return {
          ...state,
          expenses: state.expenses.map(expense =>
            expense.id === id
              ? {
                  ...expense,
                  ...updatedExpense,
                  amount: parseFloat(updatedExpense.amount),
                  date: new Date(updatedExpense.date).toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : expense
          )
        };
      }

      case ACTION_TYPES.LOAD_EXPENSES: {
        const expenses = action.payload;
        
        // Validate and sanitize loaded expenses
        const validExpenses = expenses.filter(expense => {
          const errors = validateExpense(expense);
          return errors.length === 0;
        });

        return {
          ...state,
          expenses: validExpenses
        };
      }

      case ACTION_TYPES.SET_BUDGET: {
        const budget = action.payload;
        
        if (typeof budget !== 'number' || budget < 0) {
          throw new Error('Budget must be a positive number');
        }

        return {
          ...state,
          budget: budget
        };
      }

      case ACTION_TYPES.UPDATE_CATEGORIES: {
        const categories = action.payload;
        
        if (!Array.isArray(categories)) {
          throw new Error('Categories must be an array');
        }

        return {
          ...state,
          categories: categories
        };
      }

      case ACTION_TYPES.LOAD_CATEGORIES: {
        const categories = action.payload;
        
        if (!Array.isArray(categories) || categories.length === 0) {
          return state; // Keep default categories if invalid
        }

        return {
          ...state,
          categories: categories
        };
      }

      case ACTION_TYPES.CLEAR_ALL_DATA: {
        return {
          ...initialState,
          categories: state.categories // Keep categories
        };
      }

      default:
        console.warn(`Unknown action type: ${action.type}`);
        return state;
    }
  } catch (error) {
    console.error(`Error in expenseReducer: ${error.message}`);
    // Return current state on error to prevent app crash
    return state;
  }
};

// Selector functions for derived state
export const selectors = {
  getTotalExpenses: (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },

  getExpensesByCategory: (expenses) => {
    return expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(expense);
      return acc;
    }, {});
  },

  getExpensesByDateRange: (expenses, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= start && expenseDate <= end;
    });
  },

  getMonthlyExpenses: (expenses) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  },

  getCategoryTotals: (expenses, categories) => {
    const totals = {};
    
    categories.forEach(category => {
      totals[category.id] = {
        ...category,
        total: 0,
        count: 0
      };
    });

    expenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category].total += expense.amount;
        totals[expense.category].count += 1;
      }
    });

    return Object.values(totals);
  },

  getBudgetStatus: (expenses, budget) => {
    const totalSpent = selectors.getTotalExpenses(expenses);
    const remaining = budget - totalSpent;
    const percentageSpent = budget > 0 ? (totalSpent / budget) * 100 : 0;
    
    let status = 'safe';
    if (percentageSpent >= 100) {
      status = 'exceeded';
    } else if (percentageSpent >= 80) {
      status = 'warning';
    } else if (percentageSpent >= 60) {
      status = 'moderate';
    }

    return {
      totalSpent,
      remaining,
      percentageSpent,
      status,
      isOverBudget: totalSpent > budget
    };
  },

  getRecentExpenses: (expenses, limit = 5) => {
    return expenses
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  }
};