import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const errType = urlParams.get('error');

    if (errType === 'social_failed') {
      setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    }

    if (token) {
      const gEmail = urlParams.get('email');
      const gName = decodeURIComponent(urlParams.get('name') || 'Google User');
      const gAvatar = decodeURIComponent(urlParams.get('avatar') || '');
      
      const userData = { 
        name: gName, 
        email: gEmail,
        avatar: gAvatar,
        role: 'USER'
      };
      
      login(userData, token);
      navigate('/');
    }
  }, [login, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.accessToken);
        navigate('/');
      } else {
        setError(data.message || 'Email hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Hãy đảm bảo microservices đã được khởi chạy.');
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
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="auth-error-msg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
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
            
            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <span className="auth-forgot-link">
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            <button 
              onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
              style={{ width: '100%', padding: '1.5rem', background: 'white', border: '1px solid #eee', borderRadius: '50px', fontSize: '1.4rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', transition: 'all 0.2s' }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" />
              Tiếp tục với Google
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;
