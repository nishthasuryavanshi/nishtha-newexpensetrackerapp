import React, { useMemo } from 'react';
import { selectors } from '../utils/expenseReducer';

const Analytics = ({ expenses, budget }) => {
  const analytics = useMemo(() => {
    if (!expenses.length) return null;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === date.getMonth() && 
               expenseDate.getFullYear() === date.getFullYear();
      });
      
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        total: selectors.getTotalExpenses(monthExpenses),
        count: monthExpenses.length
      });
    }

    // Category analysis
    const categoryTotals = {};
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = { total: 0, count: 0 };
      }
      categoryTotals[expense.category].total += expense.amount;
      categoryTotals[expense.category].count += 1;
    });

    // Daily average
    const oldestExpense = expenses.reduce((oldest, expense) => 
      new Date(expense.date) < new Date(oldest.date) ? expense : oldest
    );
    const daysSinceFirst = Math.max(1, Math.ceil(
      (now - new Date(oldestExpense.date)) / (1000 * 60 * 60 * 24)
    ));

    const totalSpent = selectors.getTotalExpenses(expenses);
    const currentMonthExpenses = selectors.getMonthlyExpenses(expenses);
    const currentMonthTotal = selectors.getTotalExpenses(currentMonthExpenses);

    return {
      monthlyData,
      categoryTotals,
      totalSpent,
      currentMonthTotal,
      dailyAverage: totalSpent / daysSinceFirst,
      expenseCount: expenses.length,
      averageExpense: totalSpent / expenses.length,
      budgetStatus: selectors.getBudgetStatus(currentMonthExpenses, budget)
    };
  }, [expenses, budget]);

  if (!analytics) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
          <p className="text-secondary">Insights and trends from your expense data</p>
        </div>
        
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">No Data Available</h3>
            <p className="text-secondary">Add some expenses to see analytics and insights</p>
          </div>
        </div>
      </div>
    );
  }

  const maxMonthlyAmount = Math.max(...analytics.monthlyData.map(d => d.total));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
        <p className="text-secondary">Insights and trends from your expense data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-primary">₹{analytics.totalSpent.toLocaleString()}</p>
                <p className="text-secondary text-sm mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">This Month</p>
                <p className="text-2xl font-bold text-primary">₹{analytics.currentMonthTotal.toLocaleString()}</p>
                <p className="text-secondary text-sm mt-1">
                  {analytics.budgetStatus.percentageSpent.toFixed(1)}% of budget
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(analytics.dailyAverage).toLocaleString()}</p>
                <p className="text-secondary text-sm mt-1">Per day</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm font-medium mb-1">Avg. Expense</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(analytics.averageExpense).toLocaleString()}</p>
                <p className="text-secondary text-sm mt-1">{analytics.expenseCount} transactions</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-6">Monthly Spending Trend</h3>
          <div className="space-y-4">
            {analytics.monthlyData.map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-primary">{month.month}</span>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-primary">₹{month.total.toLocaleString()}</span>
                    <span className="text-xs text-secondary ml-2">({month.count} expenses)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${maxMonthlyAmount > 0 ? (month.total / maxMonthlyAmount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-primary mb-6">Top Categories</h3>
            <div className="space-y-4">
              {Object.entries(analytics.categoryTotals)
                .sort(([,a], [,b]) => b.total - a.total)
                .slice(0, 5)
                .map(([categoryId, data], index) => {
                  const percentage = (data.total / analytics.totalSpent) * 100;
                  return (
                    <div key={categoryId} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-primary">
                          Category {index + 1}
                        </span>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-primary">₹{data.total.toLocaleString()}</span>
                          <span className="text-xs text-secondary ml-2">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-purple-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-green-500' :
                            index === 3 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold text-primary mb-6">Budget Analysis</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={
                        analytics.budgetStatus.status === 'safe' ? '#10b981' :
                        analytics.budgetStatus.status === 'moderate' ? '#f59e0b' :
                        analytics.budgetStatus.status === 'warning' ? '#f97316' : '#ef4444'
                      }
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(analytics.budgetStatus.percentageSpent * 2.83, 283)} 283`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {analytics.budgetStatus.percentageSpent.toFixed(0)}%
                      </div>
                      <div className="text-xs text-secondary">Used</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Budget</span>
                  <span className="font-semibold text-primary">₹{budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Spent</span>
                  <span className="font-semibold text-primary">₹{analytics.currentMonthTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span className="text-secondary">Remaining</span>
                  <span className={`font-semibold ${
                    analytics.budgetStatus.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{Math.abs(analytics.budgetStatus.remaining).toLocaleString()}
                    {analytics.budgetStatus.remaining < 0 ? ' over' : ''}
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-lg text-sm ${
                analytics.budgetStatus.status === 'safe' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                analytics.budgetStatus.status === 'moderate' ? 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                analytics.budgetStatus.status === 'warning' ? 'bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span>
                    {analytics.budgetStatus.status === 'safe' ? '✅' :
                     analytics.budgetStatus.status === 'moderate' ? '⚠️' :
                     analytics.budgetStatus.status === 'warning' ? '🔶' : '🚨'}
                  </span>
                  <span className="font-medium">
                    {analytics.budgetStatus.status === 'safe' ? 'Budget on track' :
                     analytics.budgetStatus.status === 'moderate' ? 'Monitor spending' :
                     analytics.budgetStatus.status === 'warning' ? 'Approaching limit' : 'Budget exceeded'}
                  </span>
                </div>
                <p className="mt-1">
                  {analytics.budgetStatus.status === 'safe' && 'You\'re spending within your budget. Keep it up!'}
                  {analytics.budgetStatus.status === 'moderate' && 'You\'ve used over half your budget. Consider tracking more closely.'}
                  {analytics.budgetStatus.status === 'warning' && 'You\'re approaching your budget limit. Review upcoming expenses.'}
                  {analytics.budgetStatus.status === 'exceeded' && 'You\'ve exceeded your budget. Consider adjusting spending or budget.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="card">
        <div className="card-body">
          <h3 className="text-lg font-semibold text-primary mb-6">Smart Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-primary">Spending Patterns</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    📈
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Peak Spending</p>
                    <p className="text-xs text-secondary">
                      {analytics.monthlyData.reduce((peak, month) => 
                        month.total > peak.total ? month : peak
                      ).month} was your highest spending month
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                    💡
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Average Transaction</p>
                    <p className="text-xs text-secondary">
                      Your typical expense is ₹{Math.round(analytics.averageExpense)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    🎯
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Daily Budget</p>
                    <p className="text-xs text-secondary">
                      ₹{Math.round(budget / 30)} per day to stay on budget
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-primary">Recommendations</h4>
              <div className="space-y-3">
                {analytics.budgetStatus.status === 'exceeded' && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
                      🚨
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">Budget Alert</p>
                      <p className="text-xs text-secondary">
                        Consider increasing your budget or reducing expenses in top categories
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
                    📊
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Track Categories</p>
                    <p className="text-xs text-secondary">
                      Monitor your top spending categories more closely
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-0.5">
                    📅
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Set Goals</p>
                    <p className="text-xs text-secondary">
                      Set monthly targets for each category to improve control
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;