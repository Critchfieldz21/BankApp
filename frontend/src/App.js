import React, { useState, useEffect } from 'react';
import LoginPage from './components/pages/LoginPage/LoginPage';
import ForgotPassword from './components/pages/ForgotPassword/ForgotPassword';
import Dashboard from './components/pages/Dashboard/Dashboard';
import AdminDashboard from './components/pages/AdminDashboard/AdminDashboard';
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
          {user.username === 'admin' ? (
            <AdminDashboard user={user} />
          ) : (
            <>
              {activeTab === 'home' && <Dashboard user={user} onLogout={handleLogout} />}
              {activeTab === 'transfer' && <TransferFunds user={user} />}
              {activeTab === 'settings' && <Settings user={user} onLogout={handleLogout} />}
              <BottomNavBar currentPage={activeTab === 'home' ? 'dashboard' : activeTab} onNavigate={handleTabChange} />
            </>
          )}
          {user.username === 'admin' && (
            <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <button onClick={handleLogout} style={{ border: 'none', background: '#ff6b6b', color: 'white', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Logout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
