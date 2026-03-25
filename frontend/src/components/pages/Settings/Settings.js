import React, { useState } from 'react';
import './Settings.css';

function Settings({ user, onLogout }) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    // In a real app, this would make an API call to change password
    setMessage('✅ Password changed successfully! (This is a demo)');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowChangePassword(false);
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>

        <div className="settings-section">
          <h3>Account Information</h3>
          <div className="info-row">
            <span className="label">Username:</span>
            <span className="value">{user.username}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="label">Full Name:</span>
            <span className="value">{user.full_name}</span>
          </div>
          <div className="info-row">
            <span className="label">Account Number:</span>
            <span className="value">{user.account_number}</span>
          </div>
          <div className="info-row">
            <span className="label">Current Balance:</span>
            <span className="value highlight">${user.balance.toFixed(2)}</span>
          </div>
          <div className="info-row">
            <span className="label">Member Since:</span>
            <span className="value">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="settings-section">
          <h3>Security</h3>
          <button 
            className="change-password-btn"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? 'Cancel' : 'Change Password'}
          </button>

          {showChangePassword && (
            <form onSubmit={handleChangePassword} className="password-form">
              {message && <div className="success-message">{message}</div>}
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <button type="submit" className="submit-btn">
                Update Password
              </button>
            </form>
          )}
        </div>

        <div className="settings-section">
          <h3>Actions</h3>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
