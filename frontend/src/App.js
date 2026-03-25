import React, { useState, useEffect } from 'react';
import LoginPage from './components/pages/LoginPage/LoginPage';
import ForgotPassword from './components/pages/ForgotPassword/ForgotPassword';
import Dashboard from './components/pages/Dashboard/Dashboard';
import TransferFunds from './components/pages/TransferFunds/TransferFunds';
import Settings from './components/pages/Settings/Settings';
import BottomNavBar from './components/navigation/BottomNavBar/BottomNavBar';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab('home');
    setShowForgotPassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('home');
  };

  const handleTabChange = (tab) => {
    // Map 'dashboard' from BottomNavBar to 'home' for internal state
    const mappedTab = tab === 'dashboard' ? 'home' : tab;
    setActiveTab(mappedTab);
  };

  return (
    <div className="App">
      {!user ? (
        showForgotPassword ? (
          <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
        ) : (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onForgotPasswordClick={() => setShowForgotPassword(true)}
          />
        )
      ) : (
        <>
          {activeTab === 'home' && <Dashboard user={user} onLogout={handleLogout} />}
          {activeTab === 'transfer' && <TransferFunds user={user} />}
          {activeTab === 'settings' && <Settings user={user} onLogout={handleLogout} />}
          <BottomNavBar currentPage={activeTab === 'home' ? 'dashboard' : activeTab} onNavigate={handleTabChange} />
        </>
      )}
    </div>
  );
}

export default App;
