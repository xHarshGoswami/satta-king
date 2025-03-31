import React from 'react';
import './Header.css';
import logo from '../../assets/homeImages/king.png';

const Header: React.FC = () => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="logo-container pulse">
          <img src={logo} alt="Satta King Logo" className="logo rotate" />
        </div>
        <div className="header-title">
          <h1 className="glow" data-text="SATTA-KING-RESULT.COM">SATTA-KING-RESULT.COM</h1>
          <div className="promo-text">
            <p className="blink">🔥 FASTEST RESULT 🔥</p>
            <p className="shine">💎 WIN UP TO 10 LAKHS 💎</p>

            <p className="flash">✨ TRUSTED BY MILLIONS ✨</p>
          </div>
        </div>
      </div>
      <div className="marquee">
        <p>🎯 आज का Special Game अभी जॉइन करें! | VIP गेम्स अवेलेबल | 24x7 सर्विस उपलब्ध 🎯</p>
      </div>
    </div>
  );
};

export default Header;