import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import API_BASE_URL from '../../../config/api';

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1); // Step 1: Find user, Step 2: Reset password
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [foundUser, setFoundUser] = useState(null);

  const handleSearchUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (!username || !email) {
        setError('Please enter both username and email');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/user/search?username=${username}&email=${email}`
      );

      if (response.data.found) {
        setFoundUser(response.data.user);
        setMessage('User found! Please set a new password.');
        setStep(2);
      } else {
        setError('User not found. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error searching for user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (!newPassword || !confirmPassword) {
        setError('Please fill in both password fields');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/user/reset-password`, {
        user_id: foundUser.id,
        new_password: newPassword
      });

      if (response.data.success) {
        setMessage('✅ Password reset successfully! Please log in with your new password.');
        setTimeout(onBack, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Reset Your Password</h2>

        {step === 1 ? (
          <div>
            <p className="step-info">Step 1: Verify Your Account</p>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSearchUser}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? 'Searching...' : 'Find Account'}
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p className="step-info">Step 2: Set New Password</p>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {foundUser && (
              <div className="user-confirmation">
                <p>Account: <strong>{foundUser.username}</strong></p>
                <p>Email: <strong>{foundUser.email}</strong></p>
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
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
                  required
                />
              </div>

              <button type="submit" className="reset-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <button 
              className="back-link"
              onClick={() => {
                setStep(1);
                setUsername('');
                setEmail('');
                setNewPassword('');
                setConfirmPassword('');
                setFoundUser(null);
                setError('');
              }}
            >
              Back to Account Verification
            </button>
          </div>
        )}

        <button className="cancel-link" onClick={onBack}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
