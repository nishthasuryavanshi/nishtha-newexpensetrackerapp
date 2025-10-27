import React, { useState, useCallback } from 'react';
import { useNotifications } from '../utils/NotificationContext';

const ExpenseForm = ({ onAddExpense, categories }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotifications();

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: formData.date
      };

      await onAddExpense(expenseData);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      setErrors({});
    } catch (error) {
      showNotification('Failed to add expense. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onAddExpense, showNotification]);

  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Add New Expense</h1>
        <p className="text-secondary">Track your spending by adding a new expense entry</p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="card-body space-y-6">
          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-secondary text-lg">₹</span>
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`form-input pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`form-input ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter expense description"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category and Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Field */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select ${errors.category ? 'border-red-500' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {selectedCategory && (
                  <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                    <span className="text-lg">{selectedCategory.icon}</span>
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Date Field */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`form-input ${errors.date ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Notes Field */}
          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Add any additional notes about this expense"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          {/* Preview Card */}
          {(formData.amount || formData.description || formData.category) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-primary mb-3">Preview</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-lg">
                      {selectedCategory ? selectedCategory.icon : '💰'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-primary">
                      {formData.description || 'Expense description'}
                    </p>
                    <p className="text-sm text-secondary">
                      {selectedCategory ? selectedCategory.name : 'Category'} • {formData.date || 'Date'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    ₹{formData.amount || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({
                  amount: '',
                  description: '',
                  category: '',
                  date: new Date().toISOString().split('T')[0],
                  notes: ''
                });
                setErrors({});
              }}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Quick Add Section */}
      <div className="card mt-6">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Add</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { amount: 50, desc: 'Coffee', category: categories[0]?.id },
              { amount: 200, desc: 'Lunch', category: categories[0]?.id },
              { amount: 500, desc: 'Groceries', category: categories[3]?.id },
              { amount: 100, desc: 'Transport', category: categories[1]?.id }
            ].map((preset, index) => (
              <button
                key={index}
                onClick={() => {
                  if (preset.category) {
                    setFormData(prev => ({
                      ...prev,
                      amount: preset.amount.toString(),
                      description: preset.desc,
                      category: preset.category
                    }));
                  }
                }}
                className="p-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <div className="font-medium text-primary">₹{preset.amount}</div>
                <div className="text-sm text-secondary">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;