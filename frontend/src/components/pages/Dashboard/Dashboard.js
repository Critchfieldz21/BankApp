import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Dashboard.css';
import API_BASE_URL from '../../../config/api';

function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    description: ''
  });
  const [currentUser, setCurrentUser] = useState(user);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/transactions/${user.id}`);
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/transactions/${user.id}`,
        {
          type: formData.type,
          amount: parseFloat(formData.amount),
          description: formData.description
        }
      );
      
      setCurrentUser({
        ...currentUser,
        balance: response.data.new_balance
      });
      
      setFormData({ type: 'deposit', amount: '', description: '' });
      setShowTransactionForm(false);
      fetchTransactions();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating transaction');
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Four Cs Bank</h1>
          <div className="user-info">
            <span>Welcome, {currentUser.full_name}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Account Overview */}
        <section className="account-overview">
          <div className="overview-card">
            <h2>Account Overview</h2>
            <div className="account-details">
              <div className="detail-item">
                <label>Account Number</label>
                <p>{currentUser.account_number}</p>
              </div>
              <div className="detail-item">
                <label>Current Balance</label>
                <p className="balance">${currentUser.balance.toFixed(2)}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{currentUser.email}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTransactionForm(!showTransactionForm)}
              className="transaction-btn"
            >
              {showTransactionForm ? 'Cancel' : 'New Transaction'}
            </button>
          </div>
        </section>

        {/* Transaction Form */}
        {showTransactionForm && (
          <section className="transaction-form-section">
            <form onSubmit={handleSubmitTransaction} className="transaction-form">
              <h3>Create Transaction</h3>
              
              <div className="form-group">
                <label htmlFor="type">Transaction Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Optional"
                />
              </div>

              <button type="submit" className="submit-btn">Submit Transaction</button>
            </form>
          </section>
        )}

        {/* Transaction History */}
        <section className="transaction-history">
          <h2>Transaction History</h2>
          
          {loading ? (
            <p className="loading">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet</p>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div key={transaction.id} className={`transaction-item ${transaction.transaction_type}`}>
                  <div className="transaction-info">
                    <span className="transaction-type">
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </span>
                    <span className="transaction-description">
                      {transaction.description || 'No description'}
                    </span>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.transaction_type}`}>
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <span className="date">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
