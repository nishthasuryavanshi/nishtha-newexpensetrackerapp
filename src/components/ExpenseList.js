import React, { useState, useMemo } from 'react';
import { useNotifications } from '../utils/NotificationContext';

const ExpenseItem = ({ expense, categories, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    amount: expense.amount,
    description: expense.description,
    category: expense.category,
    date: new Date(expense.date).toISOString().split('T')[0],
    notes: expense.notes || ''
  });

  const category = categories.find(cat => cat.id === expense.category);
  const { showNotification } = useNotifications();

  const handleEdit = async () => {
    try {
      await onEdit(expense.id, editData);
      setIsEditing(false);
      setIsExpanded(false);
    } catch (error) {
      showNotification('Failed to update expense', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await onDelete(expense.id);
      } catch (error) {
        showNotification('Failed to delete expense', 'error');
      }
    }
  };

  return (
    <div className="card animate-fadeIn">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: category?.color + '20' }}>
              <span className="text-xl">{category?.icon || '💰'}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-primary">{expense.description}</h3>
                <span className="text-xl font-bold text-primary">₹{expense.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-secondary">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {category?.name || 'Uncategorized'}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && !isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary">Created:</span>
                <span className="ml-2 text-primary">{new Date(expense.createdAt).toLocaleString()}</span>
              </div>
              {expense.updatedAt !== expense.createdAt && (
                <div>
                  <span className="text-secondary">Updated:</span>
                  <span className="ml-2 text-primary">{new Date(expense.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
            {expense.notes && (
              <div className="mt-3">
                <span className="text-secondary block mb-1">Notes:</span>
                <p className="text-primary bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{expense.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slideUp">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    value={editData.amount}
                    onChange={(e) => setEditData(prev => ({...prev, amount: parseFloat(e.target.value) || 0}))}
                    className="form-input"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => setEditData(prev => ({...prev, date: e.target.value}))}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({...prev, description: e.target.value}))}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData(prev => ({...prev, category: e.target.value}))}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Notes</label>
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData(prev => ({...prev, notes: e.target.value}))}
                  className="form-textarea"
                  rows="2"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  className="btn btn-primary btn-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ExpenseList = ({ expenses, categories, onEditExpense, onDeleteExpense }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || expense.category === selectedCategory;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const expenseDate = new Date(expense.date);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = expenseDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = expenseDate >= weekAgo;
            break;
          case 'month':
            matchesDate = expenseDate.getMonth() === now.getMonth() && 
                         expenseDate.getFullYear() === now.getFullYear();
            break;
          case 'year':
            matchesDate = expenseDate.getFullYear() === now.getFullYear();
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesCategory && matchesDate;
    });

    // Sort expenses
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          const catA = categories.find(c => c.id === a.category)?.name || '';
          const catB = categories.find(c => c.id === b.category)?.name || '';
          comparison = catA.localeCompare(catB);
          break;
        case 'date':
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [expenses, categories, searchTerm, selectedCategory, sortBy, sortOrder, dateFilter]);

  const totalAmount = filteredAndSortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">All Expenses</h1>
          <p className="text-secondary">
            {filteredAndSortedExpenses.length} expenses • Total: ₹{totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="form-label">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="form-label">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="form-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="form-label">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select flex-1"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="description">Description</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="btn btn-secondary p-2"
                >
                  <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory || dateFilter !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setDateFilter('all');
                }}
                className="btn btn-secondary btn-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">No expenses found</h3>
              <p className="text-secondary mb-4">
                {searchTerm || selectedCategory || dateFilter !== 'all'
                  ? "No expenses match your current filters"
                  : "You haven't added any expenses yet"
                }
              </p>
              {(!searchTerm && !selectedCategory && dateFilter === 'all') && (
                <button className="btn btn-primary">
                  Add Your First Expense
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredAndSortedExpenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              categories={categories}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))
        )}
      </div>

      {/* Load More / Pagination could go here */}
      {filteredAndSortedExpenses.length > 10 && (
        <div className="text-center">
          <button className="btn btn-secondary">
            Load More Expenses
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;