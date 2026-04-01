import React, { useState } from 'react';
import './AddExpense.css';

export default function AddExpense({ members, onAddExpense }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    selectedMembers: [],
    useCustomSplit: false,
    splits: {} // { memberId: percent }
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

  const toggleMember = (memberId) => {
    setFormData(prev => {
      const selected = prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter(id => id !== memberId)
        : [...prev.selectedMembers, memberId];

      // initialize splits equally when adding
      const splits = { ...prev.splits };
      if (!prev.selectedMembers.includes(memberId)) {
        const equal = Math.floor(100 / (selected.length || 1));
        // set equal shares for all selected
        selected.forEach((id, idx) => {
          splits[id] = idx === selected.length - 1
            ? 100 - Object.keys(splits).reduce((s, k) => s + (splits[k] || 0), 0)
            : equal;
        });
      } else {
        // remove split for deselected
        delete splits[memberId];
      }

      return {
        ...prev,
        selectedMembers: selected,
        splits
      };
    });
  };

  const handleSplitChange = (memberId, value) => {
    const percent = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      splits: {
        ...prev.splits,
        [memberId]: percent
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Please enter expense title');
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (formData.selectedMembers.length === 0) {
      setError('Please select at least one member');
      return;
    }

    // validate splits
    const splitsArray = formData.selectedMembers.map(id => ({ id, percent: formData.splits[id] || 0 }));
    const totalPercent = splitsArray.reduce((s, it) => s + it.percent, 0);
    if (formData.useCustomSplit && Math.round(totalPercent) !== 100) {
      setError('Custom splits must sum to 100%');
      return;
    }

    const expense = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
      members: formData.selectedMembers,
      splits: formData.useCustomSplit ? splitsArray : formData.selectedMembers.map(id => ({ id, percent: 100 / formData.selectedMembers.length }))
    };

    onAddExpense(expense);
    setSuccess('Expense added successfully!');
    
    setFormData({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      selectedMembers: []
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const splitAmount = formData.amount && formData.selectedMembers.length > 0
    ? (parseFloat(formData.amount) / formData.selectedMembers.length).toFixed(2)
    : '0.00';

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>Add Expense</h1>
        <p>Record and split expenses among household members</p>
      </div>

      <div className="add-expense-content">
        <div className="expense-form-section">
          <form className="expense-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Expense Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Groceries, Rent, Utilities"
                maxLength="50"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount (kshs)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Select Members to Split</label>
              <div className="members-checkboxes">
                {members.length === 0 ? (
                  <p className="no-members">No members added yet. Please add members first.</p>
                ) : (
                  members.map(member => (
                    <label key={member.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.selectedMembers.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                      />
                      <span className="checkbox-text">{member.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {formData.selectedMembers.length > 0 && (
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={formData.useCustomSplit} onChange={() => setFormData(prev => ({ ...prev, useCustomSplit: !prev.useCustomSplit }))} />
                  &nbsp;Use custom percentage splits
                </label>

                {formData.selectedMembers.map(id => {
                  const member = members.find(m => m.id === id);
                  const percent = formData.splits[id] !== undefined ? formData.splits[id] : (100 / formData.selectedMembers.length);
                  return (
                    <div key={id} className="split-row">
                      <span>{member?.name}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={percent}
                        disabled={!formData.useCustomSplit}
                        onChange={(e) => handleSplitChange(id, e.target.value)}
                        className="split-input"
                      />
                      <span>%</span>
                    </div>
                  );
                })}
                {formData.useCustomSplit && (
                  <div className="split-note">Total: {formData.selectedMembers.reduce((s, id) => s + (formData.splits[id] || 0), 0)}%</div>
                )}
              </div>
            )}

            {formData.selectedMembers.length > 0 && formData.amount && (
              <div className="split-info">
                <div className="split-item">
                  <span>Amount per person:</span>
                  <strong>kshs{splitAmount}</strong>
                </div>
                <div className="split-item">
                  <span>Number of people:</span>
                  <strong>{formData.selectedMembers.length}</strong>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={members.length === 0}
            >
              Add Expense
            </button>
          </form>
        </div>

        <div className="expense-preview">
          <div className="preview-card">
            <h3>Transaction Preview</h3>
            {formData.title && (
              <>
                <div className="preview-item">
                  <span>Title:</span>
                  <strong>{formData.title}</strong>
                </div>
                <div className="preview-item">
                  <span>Amount:</span>
                  <strong>kshs{formData.amount || '0.00'}</strong>
                </div>
                <div className="preview-item">
                  <span>Date:</span>
                  <strong>{new Date(formData.date).toLocaleDateString()}</strong>
                </div>
                <div className="preview-item">
                  <span>Members:</span>
                  <strong>{formData.selectedMembers.length} selected</strong>
                </div>
                {formData.selectedMembers.length > 0 && (
                  <div className="preview-item">
                    <span>Per Person:</span>
                    <strong>kshs{splitAmount}</strong>
                  </div>
                )}
              </>
            )}
            {!formData.title && (
              <p className="placeholder-text">Fill in the form to see preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
