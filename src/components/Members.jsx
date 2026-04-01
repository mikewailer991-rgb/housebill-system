import React, { useState } from 'react';
import './Members.css';

export default function Members({ members, onAddMember }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Please enter member name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (members.some(m => m.email === formData.email)) {
      setError('This email is already registered');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      balance: 0
    };

    onAddMember(newMember);
    setSuccess('Member added successfully!');
    setFormData({ name: '', email: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>Members</h1>
        <p>Manage household members and track their balances</p>
      </div>

      <div className="members-content">
        <div className="add-member-section">
          <div className="section-title">Add New Member</div>
          
          <form className="member-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Member Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </form>
        </div>

        <div className="members-list-section">
          <div className="section-title">
            Members ({members.length})
          </div>

          {members.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">👥</p>
              <p>No members added yet. Add your first member to get started!</p>
            </div>
          ) : (
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-email">{member.email}</p>
                  </div>
                  <div className="member-balance">
                    <span className="balance-label">Balance</span>
                    <span className={`balance-amount ${member.balance === 0 ? 'zero' : member.balance > 0 ? 'owes' : 'owed'}`}>
                      kshs{Math.abs(member.balance).toFixed(2)}
                    </span>
                    {member.balance > 0 && <span className="balance-status">owes</span>}
                    {member.balance < 0 && <span className="balance-status">owed</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
