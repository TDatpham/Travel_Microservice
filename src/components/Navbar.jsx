import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = ({ variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const navLinks = [
    { to: '/',             label: 'Home' },
    { to: '/hotels',       label: 'Hotels' },
    { to: '/tours',        label: 'Tours' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/activities',   label: 'Activities' },
    { to: '/about',        label: 'About Us' },
    { to: '/contact',      label: 'Contact' },
  ];

  return (
    <>
      <header className={`header ${variant === 'page' ? 'header--page' : ''}`}>
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <div className="logo-wrapper" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontFamily: 'Poppins, sans-serif'
            }}>
              <img src="/Imgs/Logo/icon.svg" alt="Icon" style={{ height: '32px' }} />
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '800', 
                color: variant === 'page' ? '#111' : '#fff',
                letterSpacing: '-0.5px'
              }}>
                Travel
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className={`navbar${isOpen ? ' active' : ''}`}>
          <ul className="navlists">
            {navLinks.map(({ to, label }) => (
              <li className="navlist" key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={close}
                  className={({ isActive }) => isActive ? 'nav-active' : ''}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/signin" className="btn-signin">Sign In</Link>
          <Link to="/signup" className="btn-signup">Sign Up</Link>
        </div>
      </header>

      {/* Mobile toggles */}
      {!isOpen && (
        <div className="toggleOn" onClick={() => setIsOpen(true)}>
          <i className="uil uil-align-center-alt"></i>
        </div>
      )}
      {isOpen && (
        <div className="toggleClose" onClick={() => setIsOpen(false)}>
          <i className="uil uil-multiply"></i>
        </div>
      )}
    </>
  );
};

export default Navbar;
