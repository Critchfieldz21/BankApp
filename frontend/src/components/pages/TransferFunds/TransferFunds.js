import React, { useState } from 'react';
import axios from 'axios';
import './TransferFunds.css';
import API_BASE_URL from '../../../config/api';

function TransferFunds({ user }) {
  const [amount, setAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (!amount || !recipientAccount) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/transactions/${user.id}`,
        {
          type: 'transfer',
          amount: parseFloat(amount),
          description: `Transfer to ${recipientAccount}${description ? ' - ' + description : ''}`
        }
      );

      setMessage(`✅ Transfer successful! Transferred $${amount} to ${recipientAccount}`);
      setAmount('');
      setRecipientAccount('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-container">
      <div className="transfer-card">
        <h2>Transfer Funds</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleTransfer}>
          <div className="form-group">
            <label htmlFor="amount">Amount to Transfer</label>
            <div className="amount-input">
              <span className="currency">$</span>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recipientAccount">Recipient Account Number</label>
            <input
              type="text"
              id="recipientAccount"
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              placeholder="e.g., FC1001"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this transfer for?"
            />
          </div>

          <button type="submit" className="transfer-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </form>

        <div className="transfer-info">
          <p><strong>Your Account:</strong> {user.account_number}</p>
          <p><strong>Current Balance:</strong> ${user.balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default TransferFunds;
