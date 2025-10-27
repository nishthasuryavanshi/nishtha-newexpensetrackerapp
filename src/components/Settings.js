import React, { useState } from 'react';
import { useNotifications } from '../utils/NotificationContext';

const Settings = ({ 
  budget, 
  onSetBudget, 
  categories, 
  onUpdateCategories, 
  darkMode, 
  onToggleDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [budgetInput, setBudgetInput] = useState(budget);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#6366f1', icon: '🏷️' });
  const { showNotification } = useNotifications();

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'data', label: 'Data & Privacy', icon: '🛡️' }
  ];

  const handleBudgetSave = () => {
    if (budgetInput < 0) {
      showNotification('Budget cannot be negative', 'error');
      return;
    }
    onSetBudget(parseFloat(budgetInput) || 0);
    showNotification('Budget updated successfully!', 'success');
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      showNotification('Category name is required', 'error');
      return;
    }

    const categoryWithId = {
      ...newCategory,
      id: Date.now().toString()
    };

    onUpdateCategories([...categories, categoryWithId]);
    setNewCategory({ name: '', color: '#6366f1', icon: '🏷️' });
    showNotification('Category added successfully!', 'success');
  };

  const handleEditCategory = (category) => {
    const updatedCategories = categories.map(cat =>
      cat.id === category.id ? category : cat
    );
    onUpdateCategories(updatedCategories);
    setEditingCategory(null);
    showNotification('Category updated successfully!', 'success');
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onUpdateCategories(updatedCategories);
      showNotification('Category deleted successfully!', 'success');
    }
  };

  const exportData = () => {
    const data = {
      budget,
      categories,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Settings exported successfully!', 'success');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Dark Mode</label>
                <p className="text-sm text-secondary">Switch between light and dark themes</p>
              </div>
              <button
                onClick={() => onToggleDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Language & Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Language</label>
              <select className="form-select">
                <option>English (US)</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select className="form-select">
                <option>Indian Rupee (₹)</option>
                <option>US Dollar ($)</option>
                <option>Euro (€)</option>
                <option>British Pound (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBudgetSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Monthly Budget</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label">Budget Amount</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-secondary text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="form-input pl-8"
                    placeholder="Enter monthly budget"
                    min="0"
                    step="100"
                  />
                </div>
                <button
                  onClick={handleBudgetSave}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
              <p className="text-sm text-secondary mt-2">
                Set your monthly spending limit to track your financial goals
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Budget Tips</h4>
              <ul className="text-sm text-secondary space-y-1">
                <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
                <li>• Review and adjust your budget monthly</li>
                <li>• Set alerts when you reach 80% of your budget</li>
                <li>• Include a buffer for unexpected expenses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Budget Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">80% Warning</label>
                <p className="text-sm text-secondary">Get notified when you reach 80% of budget</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Budget Exceeded</label>
                <p className="text-sm text-secondary">Alert when budget is exceeded</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Weekly Summary</label>
                <p className="text-sm text-secondary">Weekly spending summary email</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorySettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Add New Category</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="form-input"
                  placeholder="e.g., Groceries"
                />
              </div>
              <div>
                <label className="form-label">Color</label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                  className="form-input h-10"
                />
              </div>
              <div>
                <label className="form-label">Icon</label>
                <input
                  type="text"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  className="form-input text-center"
                  placeholder="🏷️"
                />
              </div>
            </div>
            <button
              onClick={handleAddCategory}
              className="btn btn-primary"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Existing Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                {editingCategory?.id === category.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        className="form-input text-sm col-span-2"
                      />
                      <input
                        type="text"
                        value={editingCategory.icon}
                        onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                        className="form-input text-sm text-center"
                      />
                    </div>
                    <input
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                      className="form-input h-8 w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(editingCategory)}
                        className="btn btn-success btn-sm flex-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-primary">{category.name}</h4>
                        <div 
                          className="w-4 h-4 rounded-full inline-block"
                          style={{ backgroundColor: category.color }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="btn btn-secondary btn-sm flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn btn-danger btn-sm flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Push Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Daily Reminders</label>
                <p className="text-sm text-secondary">Remind me to add expenses</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Budget Alerts</label>
                <p className="text-sm text-secondary">Notify when approaching budget limit</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Weekly Summary</label>
                <p className="text-sm text-secondary">Weekly spending report</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Monthly Reports</label>
                <p className="text-sm text-secondary">Detailed monthly expense report</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Goal Achievements</label>
                <p className="text-sm text-secondary">When you achieve budget goals</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Export Data</h4>
                <p className="text-sm text-secondary">Download your expense data and settings</p>
              </div>
              <button onClick={exportData} className="btn btn-secondary">
                Export
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Import Data</h4>
                <p className="text-sm text-secondary">Import expenses from CSV or JSON file</p>
              </div>
              <button className="btn btn-secondary">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-red-200 dark:border-red-800">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Clear All Data</h4>
                <p className="text-sm text-secondary">Permanently delete all expenses and reset app</p>
              </div>
              <button className="btn btn-danger">
                Clear Data
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Delete Account</h4>
                <p className="text-sm text-secondary">Permanently delete your account and all data</p>
              </div>
              <button className="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-4">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Analytics</label>
                <p className="text-sm text-secondary">Help improve the app by sharing usage data</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-primary">Crash Reports</label>
                <p className="text-sm text-secondary">Automatically send crash reports</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-purple-600" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'budget':
        return renderBudgetSettings();
      case 'categories':
        return renderCategorySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
        <p className="text-secondary">Customize your expense tracking experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-body p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-r-2 border-purple-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;