import React from 'react';
import './BottomNavBar.css';

function BottomNavBar({ currentPage, onNavigate }) {
  return (
    <nav className="bottom-nav-bar">
      <button
        className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => onNavigate('dashboard')}
      >
        <span className="nav-text">Home</span>
      </button>
      <button
        className={`nav-btn ${currentPage === 'transfer' ? 'active' : ''}`}
        onClick={() => onNavigate('transfer')}
      >
        <span className="nav-text">Transfer</span>
      </button>
      <button
        className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <span className="nav-text">Settings</span>
      </button>
    </nav>
  );
}

export default BottomNavBar;
