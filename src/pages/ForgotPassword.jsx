import React, { useState } from 'react';
import './Auth.css';

export default function ForgotPassword({ onLoginClick }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // email, verification, reset
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [savedCode, setSavedCode] = useState('');

  const handleSendReset = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Generate a fake verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSavedCode(code);
    
    setSuccess(`Verification code sent to ${email}: ${code} (for demo)`);
    setStep('verification');
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');

    if (verificationCode !== savedCode) {
      setError('Invalid verification code');
      return;
    }

    setSuccess('Code verified! Now set your new password.');
    setStep('reset');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Update password in storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
    }

    localStorage.setItem('loginAttempts', '0');
    setSuccess('Password reset successfully! Redirecting to login...');
    
    setTimeout(() => {
      onLoginClick();
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🔐</div>
        <h1>Reset Password</h1>
        <p className="auth-subtitle">We'll help you regain access to your account</p>

        {step === 'email' && (
          <form onSubmit={handleSendReset}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <small>We'll send you a code to reset your password</small>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Send Reset Code
            </button>
          </form>
        )}

        {step === 'verification' && (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
              <small>Check your email for the code</small>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Verify Code
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        )}

        <div className="auth-links">
          <button
            type="button"
            className="btn-text"
            onClick={onLoginClick}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
