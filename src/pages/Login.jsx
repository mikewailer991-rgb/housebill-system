import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin, onSignupClick, onForgotPasswordClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptCount, setAttemptCount] = useState(
    parseInt(localStorage.getItem('loginAttempts') || '0')
  );
  const [isBlocked, setIsBlocked] = useState(
    parseInt(localStorage.getItem('loginAttempts') || '0') >= 3
  );

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (isBlocked) {
      setError('Account locked. Please use "Forgot Password" to reset.');
      return;
    }

    // Simple validation - in real app, validate against backend
    if (email && password) {
      if (password === 'password123') {
        // Demo password
        localStorage.setItem('loginAttempts', '0');
        setAttemptCount(0);
        onLogin({ email, name: email.split('@')[0] });
      } else {
        const newAttempts = attemptCount + 1;
        setAttemptCount(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        if (newAttempts >= 3) {
          setIsBlocked(true);
          setError('Too many failed attempts. Account locked for security. Use "Forgot Password" to reset.');
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } else {
      setError('Please enter email and password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">💳</div>
        <h1>Household Billing System</h1>
        <p className="auth-subtitle">Split expenses with your household easily</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isBlocked}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isBlocked}
            />
            <small className="hint">Demo: Use "password123"</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={isBlocked}>
            Sign In
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            className="btn-text"
            onClick={onForgotPasswordClick}
          >
            Forgot Password?
          </button>
          <span className="divider">•</span>
          <button
            type="button"
            className="btn-text"
            onClick={onSignupClick}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
