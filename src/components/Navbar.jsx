import React from 'react';
import './Navbar.css';
import Notifications from './Notifications';

export default function Navbar({ user, onLogout, activeSection, setActiveSection }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">💳</span>
          <span className="logo-text">Household Billing</span>
        </div>

        <ul className="navbar-menu">
          <li>
            <button
              className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'addExpense' ? 'active' : ''}`}
              onClick={() => setActiveSection('addExpense')}
            >
              Add Expense
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'members' ? 'active' : ''}`}
              onClick={() => setActiveSection('members')}
            >
              Members
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveSection('payments')}
            >
              Payments
            </button>
          </li>
        </ul>

        <div className="navbar-user">
          <Notifications />
          <span className="user-name">{user?.name}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
