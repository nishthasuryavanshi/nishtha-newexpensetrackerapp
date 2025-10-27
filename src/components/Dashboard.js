import React, { useMemo } from 'react';
import { selectors } from '../utils/expenseReducer';

const StatCard = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-secondary text-sm font-medium mb-1">{title}</p>
            <div className="text-2xl font-bold text-primary mb-1">{value}</div>
            {subtitle && (
              <p className="text-secondary text-sm">{subtitle}</p>
            )}
            {trend && (
              <div className={`inline-flex items-center text-xs mt-2 px-2 py-1 rounded-full ${
                trend.positive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <svg className={`w-3 h-3 mr-1 ${trend.positive ? '' : 'transform rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                {trend.value}% vs last month
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-white`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetProgress = ({ budget, totalSpent }) => {
  const budgetStatus = selectors.getBudgetStatus([{ amount: totalSpent }], budget);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'warning': return 'bg-orange-500';
      case 'exceeded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Budget Overview</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            budgetStatus.status === 'safe' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            budgetStatus.status === 'moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            budgetStatus.status === 'warning' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {budgetStatus.status.charAt(0).toUpperCase() + budgetStatus.status.slice(1)}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Spent: ₹{totalSpent.toLocaleString()}</span>
            <span className="text-secondary">Budget: ₹{budget.toLocaleString()}</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(budgetStatus.status)}`}
              style={{ width: `${Math.min(budgetStatus.percentageSpent, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary">
              {budgetStatus.percentageSpent.toFixed(1)}% used
            </span>
            <span className={`text-sm font-medium ${
              budgetStatus.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {budgetStatus.remaining >= 0 ? '₹' + budgetStatus.remaining.toLocaleString() + ' left' : 'Over by ₹' + Math.abs(budgetStatus.remaining).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentExpenses = ({ expenses }) => {
  const recentExpenses = selectors.getRecentExpenses(expenses, 5);
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Recent Expenses</h3>
          <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentExpenses.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No expenses yet</p>
              <p className="text-sm">Add your first expense to get started</p>
            </div>
          ) : (
            recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">{expense.description}</p>
                    <p className="text-xs text-secondary">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">₹{expense.amount}</p>
                  <p className="text-xs text-secondary capitalize">{expense.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const CategoryBreakdown = ({ expenses, categories }) => {
  const categoryTotals = selectors.getCategoryTotals(expenses, categories);
  const topCategories = categoryTotals
    .filter(cat => cat.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const totalSpent = selectors.getTotalExpenses(expenses);

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Top Categories</h3>
          <span className="text-sm text-secondary">This month</span>
        </div>
        
        <div className="space-y-4">
          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <div className="w-12 h-12 mx-auto mb-3 text-4xl">📊</div>
              <p>No category data yet</p>
            </div>
          ) : (
            topCategories.map((category) => {
              const percentage = totalSpent > 0 ? (category.total / totalSpent) * 100 : 0;
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm font-medium text-primary">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-primary">₹{category.total.toLocaleString()}</span>
                      <span className="text-xs text-secondary ml-2">{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ expenses, budget }) => {
  const stats = useMemo(() => {
    const totalExpenses = selectors.getTotalExpenses(expenses);
    const monthlyExpenses = selectors.getMonthlyExpenses(expenses);
    const monthlyTotal = selectors.getTotalExpenses(monthlyExpenses);
    const budgetStatus = selectors.getBudgetStatus(monthlyExpenses, budget);
    
    // Calculate trends (mock data for now)
    const lastMonthTotal = monthlyTotal * 0.88; // Mock 12% increase
    const totalTrend = ((monthlyTotal - lastMonthTotal) / lastMonthTotal) * 100;
    
    return {
      totalExpenses,
      monthlyTotal,
      transactionCount: expenses.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      budgetStatus,
      trends: {
        total: {
          positive: totalTrend > 0,
          value: Math.abs(totalTrend).toFixed(1)
        }
      }
    };
  }, [expenses, budget]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-purple-100 mb-4">Here's what's happening with your finances today.</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Budget on track</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span>{expenses.length} transactions</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={`₹${stats.totalExpenses.toLocaleString()}`}
          subtitle="All time"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
          color="blue"
        />
        
        <StatCard
          title="This Month"
          value={`₹${stats.monthlyTotal.toLocaleString()}`}
          subtitle="Current month"
          trend={stats.trends.total}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          color="purple"
        />
        
        <StatCard
          title="Transactions"
          value={stats.transactionCount.toString()}
          subtitle="Total count"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 4h6m-3-7h.01" /></svg>}
          color="green"
        />
        
        <StatCard
          title="Avg. Expense"
          value={`₹${Math.round(stats.averageExpense).toLocaleString()}`}
          subtitle="Per transaction"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          color="yellow"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BudgetProgress budget={budget} totalSpent={stats.monthlyTotal} />
          <RecentExpenses expenses={expenses} />
        </div>
        <div>
          <CategoryBreakdown expenses={expenses} categories={[]} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;