import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, ShoppingCart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/',             label: 'Home' },
    { to: '/hotels',       label: 'Hotels' },
    { to: '/tours',        label: 'Tours' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/activities',   label: 'Activities' },
    { to: '/about',        label: 'About Us' },
    { to: '/contact',      label: 'Contact' },
  ];

  if (user && user.role === 'ADMIN') {
    navLinks.push({ to: '/admin', label: 'Admin' });
  }

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
          {user ? (
            <div className="user-nav-info" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', color: variant === 'page' ? '#333' : '#fff' }}>
              <Link to="/cart" title="My Cart" style={{ color: 'inherit', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <ShoppingCart size={22} />
              </Link>
              <Link to="/profile" title="My Profile" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', textDecoration: 'none' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.7)',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #ff7e5f, #654cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {user.avatar
                    ? <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />)
                  }
                </div>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Logout" style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn-signin">Sign In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
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
