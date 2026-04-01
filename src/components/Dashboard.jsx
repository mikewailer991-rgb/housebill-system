import React from 'react';
import './Dashboard.css';

export default function Dashboard({ expenses, payments, members }) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const remainingBalance = totalExpenses - totalPaid;

  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview of your household expenses</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">kshs{totalExpenses.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon paid">✅</div>
          <div className="stat-content">
            <p className="stat-label">Total Paid</p>
            <h2 className="stat-value">kshs{totalPaid.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon balance">⚖️</div>
          <div className="stat-content">
            <p className="stat-label">Remaining Balance</p>
            <h2 className={`stat-value ${remainingBalance > 0 ? 'negative' : 'positive'}`}>
              kshs{remainingBalance.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon members">👥</div>
          <div className="stat-content">
            <p className="stat-label">Total Members</p>
            <h2 className="stat-value">{members.length}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-expenses">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            <span className="badge">{recentExpenses.length}</span>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">📝</p>
              <p>No expenses yet. Add your first expense to get started!</p>
            </div>
          ) : (
            <div className="expenses-list">
              {recentExpenses.map((expense, idx) => (
                <div key={idx} className="expense-item">
                  <div className="expense-info">
                    <p className="expense-title">{expense.title}</p>
                    <p className="expense-meta">
                      {new Date(expense.date).toLocaleDateString()} • {expense.members?.length || 1} members
                    </p>
                  </div>
                  <div className="expense-amount">kshs{expense.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-stats">
          <div className="quick-stat-box">
            <h3>Expense Summary</h3>
            <div className="summary-item">
              <span>Avg. Expense:</span>
              <strong>kshs{(totalExpenses / (expenses.length || 1)).toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Avg. Per Member:</span>
              <strong>kshs{(totalExpenses / (members.length || 1)).toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Total Members:</span>
              <strong>{members.length}</strong>
            </div>
          </div>

          <div className="quick-stat-box">
            <h3>Payment Summary</h3>
            <div className="summary-item">
              <span>Total Payments:</span>
              <strong>kshs{totalPaid.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Avg. Payment:</span>
              <strong>kshs{(totalPaid / (payments.length || 1)).toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Pending:</span>
              <strong className={remainingBalance > 0 ? 'negative' : 'positive'}>
                kshs{remainingBalance.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
