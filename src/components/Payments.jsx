import React, { useState } from 'react';
import './Payments.css';

export default function Payments({ members, onRecordPayment, payments }) {
  const [formData, setFormData] = useState({
    payerName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
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

    if (!formData.payerName) {
      setError('Please select a payer');
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const payment = {
      id: Date.now(),
      payerName: formData.payerName,
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description || 'Payment'
    };

    onRecordPayment(payment);
    setSuccess('Payment recorded successfully!');
    
    setFormData({
      payerName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const recentPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h1>Payments</h1>
        <p>Record and track household payments</p>
      </div>

      <div className="payments-content">
        <div className="payment-form-section">
          <div className="section-title">Record Payment</div>
          
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="payer">Payer</label>
              <select
                id="payer"
                name="payerName"
                value={formData.payerName}
                onChange={handleInputChange}
              >
                <option value="">Select a member</option>
                {members.map(member => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount ($)</label>
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

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Monthly rent payment"
                maxLength="100"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={members.length === 0}
            >
              Record Payment
            </button>
          </form>
        </div>

        <div className="payment-history-section">
          <div className="section-title">
            Payment History ({recentPayments.length})
          </div>

          {recentPayments.length === 0 ? (
            <div className="empty-state">
              <p className="empty-icon">💰</p>
              <p>No payments recorded yet. Record your first payment to get started!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Payer</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map(payment => (
                    <tr key={payment.id} className="payment-row">
                      <td className="payer-cell">{payment.payerName}</td>
                      <td className="amount-cell">${payment.amount.toFixed(2)}</td>
                      <td className="description-cell">{payment.description}</td>
                      <td className="date-cell">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
