import React, { useState, useEffect } from 'react';
import { queueAction } from './utils/offline';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import Members from './components/Members';
import Payments from './components/Payments';
import './App.css';

export default function App({ onSyncQueued }) {
  const [authState, setAuthState] = useState('login'); // login, signup, forgotPassword
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);

  // Load user-specific data from localStorage
  const loadUserData = (userEmail) => {
    const userKey = `user_${userEmail}`;
    const userData = localStorage.getItem(userKey);
    
    if (userData) {
      const { members: savedMembers, expenses: savedExpenses, payments: savedPayments } = JSON.parse(userData);
      setMembers(savedMembers || []);
      setExpenses(savedExpenses || []);
      setPayments(savedPayments || []);
    } else {
      // Initialize new user with empty data
      setMembers([]);
      setExpenses([]);
      setPayments([]);
      saveUserData(userEmail, [], [], []);
    }
  };

  // Save user-specific data to localStorage
  const saveUserData = (userEmail, membersData, expensesData, paymentsData) => {
    const userKey = `user_${userEmail}`;
    localStorage.setItem(userKey, JSON.stringify({
      members: membersData,
      expenses: expensesData,
      payments: paymentsData
    }));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadUserData(userData.email);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // Attempt to sync queued actions when online
  useEffect(() => {
    if (!onSyncQueued) return;

    const syncHandler = async (action) => {
      if (!action || !action.type) return;
      if (action.type === 'addExpense') {
        applyExpense(action.data);
      } else if (action.type === 'recordPayment') {
        applyPayment(action.data);
      }
    };

    const trySync = () => {
      onSyncQueued(syncHandler).catch(e => console.warn('sync failed', e));
    };

    window.addEventListener('online', trySync);
    if (navigator.onLine) trySync();
    return () => window.removeEventListener('online', trySync);
  }, [onSyncQueued]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    loadUserData(userData.email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.setItem('loginAttempts', '0');
    setAuthState('login');
  };

  const handleAddMember = (newMember) => {
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    if (user) saveUserData(user.email, updatedMembers, expenses, payments);
  };

  const applyExpense = (expense) => {
    setExpenses(prev => {
      if (prev.some(e => e.id === expense.id)) return prev;
      const newExpenses = [...prev, expense];
      if (user) saveUserData(user.email, members, newExpenses, payments);
      return newExpenses;
    });

    setMembers(prev => {
      const updated = prev.map(m => ({ ...m }));
      (expense.splits || []).forEach(split => {
        const member = updated.find(m => m.id === split.id);
        if (member) {
          const share = (expense.amount * (split.percent / 100));
          member.balance -= share;
        }
      });
      if (user) saveUserData(user.email, updated, expenses, payments);
      return updated;
    });
  };

  const handleAddExpense = async (expense) => {
    const newExpense = { id: Date.now(), ...expense };
    applyExpense(newExpense);

    if (!navigator.onLine) {
      await queueAction({ id: newExpense.id, type: 'addExpense', data: newExpense, time: new Date().toISOString() });
    } else {
      // In a real app, send to server here and handle failures by queuing
    }
  };

  const applyPayment = (payment) => {
    setPayments(prev => {
      if (prev.some(p => p.id === payment.id)) return prev;
      const newPayments = [...prev, payment];
      if (user) saveUserData(user.email, members, expenses, newPayments);
      return newPayments;
    });

    setMembers(prev => {
      const updatedMembers = prev.map(m => ({ ...m }));
      const negativeMembers = updatedMembers.filter(m => m.balance < 0);
      const totalOwed = negativeMembers.reduce((s, m) => s + Math.abs(m.balance), 0);

      if (totalOwed > 0) {
        if (payment.amount >= totalOwed) {
          negativeMembers.forEach(m => { m.balance = 0; });
          const leftover = payment.amount - totalOwed;
          const payer = updatedMembers.find(m => m.name === payment.payerName);
          if (payer) payer.balance += leftover;
        } else {
          let allocated = 0;
          negativeMembers.forEach((m, idx) => {
            const portion = (Math.abs(m.balance) / totalOwed) * payment.amount;
            const alloc = idx === negativeMembers.length - 1 ? (payment.amount - allocated) : portion;
            m.balance += alloc;
            allocated += alloc;
          });
        }
      } else {
        const payer = updatedMembers.find(m => m.name === payment.payerName);
        if (payer) payer.balance += payment.amount;
      }

      if (user) saveUserData(user.email, updatedMembers, expenses, payments);
      return updatedMembers;
    });
  };

  const handleRecordPayment = async (payment) => {
    const p = { id: payment.id || Date.now(), ...payment };
    applyPayment(p);
    if (!navigator.onLine) {
      await queueAction({ id: p.id, type: 'recordPayment', data: p, time: new Date().toISOString() });
    } else {
      // send to server in real app
    }
  };

  const [activeSection, setActiveSection] = useState('dashboard');

  // Authentication pages
  if (!user) {
    return (
      <>
        {authState === 'login' && (
          <Login
            onLogin={handleLogin}
            onSignupClick={() => setAuthState('signup')}
            onForgotPasswordClick={() => setAuthState('forgotPassword')}
          />
        )}
        {authState === 'signup' && (
          <Signup
            onSignup={handleLogin}
            onLoginClick={() => setAuthState('login')}
          />
        )}
        {authState === 'forgotPassword' && (
          <ForgotPassword
            onLoginClick={() => setAuthState('login')}
          />
        )}
      </>
    );
  }

  // Dashboard pages
  return (
    <div className="app">
      <Navbar
        user={user}
        onLogout={handleLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="app-main">
        {activeSection === 'dashboard' && (
          <Dashboard
            expenses={expenses}
            payments={payments}
            members={members}
          />
        )}
        {activeSection === 'addExpense' && (
          <AddExpense
            members={members}
            onAddExpense={handleAddExpense}
          />
        )}
        {activeSection === 'members' && (
          <Members
            members={members}
            onAddMember={handleAddMember}
          />
        )}
        {activeSection === 'payments' && (
          <Payments
            members={members}
            onRecordPayment={handleRecordPayment}
            payments={payments}
          />
        )}
      </main>
    </div>
  );
}
