import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.accessToken);
        alert('Đăng ký thành công!');
        navigate('/');
      } else {
        setError(data.message || 'Đăng ký thất bại.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ backend.');
    } finally {
      setLoading(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-home">
        <ChevronLeft size={20} /> Back to Home
      </Link>
      
      <div className="auth-container">
        <motion.div
          className="auth-card"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join us and explore the world's top destinations.</p>
          </div>

          {error && (
            <div className="auth-error-msg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="auth-input-group">
              <User size={20} className="auth-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>

            <div className="auth-input-group">
              <Mail size={20} className="auth-icon" />
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="auth-input-group">
              <Lock size={20} className="auth-icon" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="auth-input-group">
              <Lock size={20} className="auth-icon" />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            
            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" required /> I agree to the <Link to="#">Terms & Conditions</Link>
              </label>
            </div>

            <button type="submit" className="auth-btn-primary" style={{marginTop: '1rem'}} disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            <button className="auth-btn-social" onClick={() => window.location.href = '/oauth2/authorization/google'}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" />
              Sign up with Google
            </button>
          </div>

          <div className="auth-footer">
            Already have an account? <Link to="/signin">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
