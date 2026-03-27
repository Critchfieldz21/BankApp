import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import API_BASE_URL from '../../../config/api';

function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  const isAdmin = user && user.username === 'admin';

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Verify user is admin before fetching data
      if (user.username !== 'admin') {
        setError('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      // Fetch all users with admin verification
      const usersResponse = await axios.get(`${API_BASE_URL}/api/admin/users?username=${user.username}`);
      setUsers(usersResponse.data.users);

      // Fetch stats with admin verification
      const statsResponse = await axios.get(`${API_BASE_URL}/api/admin/stats?username=${user.username}`);
      setStats(statsResponse.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access Denied - Admin only');
      } else {
        setError(err.response?.data?.error || 'Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  }, [user.username]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setError('Access Denied - Admin access only');
      setLoading(false);
    }
  }, [isAdmin, fetchAdminData]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error-full">
          <h2>🔒 Access Denied</h2>
          <p>You do not have permission to access the admin dashboard.</p>
          <p>Only administrators can view this page.</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('Access Denied')) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-error-full">
          <h2>🔒 {error}</h2>
          <p>This page is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p>Welcome, {user.full_name}</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.total_users}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">${stats.total_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Balance</div>
            <div className="stat-value">${stats.average_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{stats.total_transactions}</div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="admin-search">
        <input
          type="text"
          placeholder="Search by username, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="search-results-count">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-users-section">
        <h2>All User Accounts</h2>
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Account Number</th>
                <th>Balance</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="cell-id">{user.id}</td>
                  <td className="cell-username">
                    <span className="username-badge">@{user.username}</span>
                  </td>
                  <td className="cell-name">{user.full_name}</td>
                  <td className="cell-email">{user.email}</td>
                  <td className="cell-account">
                    <span className="account-number">{user.account_number}</span>
                  </td>
                  <td className="cell-balance">
                    <span className="balance-badge">
                      ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="cell-created">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="no-results">
          <p>No users found matching "{searchTerm}"</p>
        </div>
      )}

      <button onClick={fetchAdminData} className="refresh-btn">
        🔄 Refresh Data
      </button>
    </div>
  );
}

export default AdminDashboard;
