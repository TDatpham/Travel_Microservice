import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ChevronLeft } from 'lucide-react';

const SignUpPage = () => {
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

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-input-group">
              <User size={20} className="auth-icon" />
              <input type="text" placeholder="Full Name" required />
            </div>

            <div className="auth-input-group">
              <Mail size={20} className="auth-icon" />
              <input type="email" placeholder="Email Address" required />
            </div>
            
            <div className="auth-input-group">
              <Lock size={20} className="auth-icon" />
              <input type="password" placeholder="Password" required />
            </div>

            <div className="auth-input-group">
              <Lock size={20} className="auth-icon" />
              <input type="password" placeholder="Confirm Password" required />
            </div>
            
            <div className="auth-options">
              <label className="auth-checkbox">
                <input type="checkbox" required /> I agree to the <Link to="#">Terms & Conditions</Link>
              </label>
            </div>

            <button type="submit" className="auth-btn-primary" style={{marginTop: '1rem'}}>
              Sign Up
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <div className="auth-social">
            <button className="auth-btn-social">
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
