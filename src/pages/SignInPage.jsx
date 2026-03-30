import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, ChevronLeft, MoveRight, User } from 'lucide-react';

const SignInPage = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot_request' | 'forgot_otp' | 'forgot_reset'

  // Handles smooth transition animations
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-home">
        <ChevronLeft size={20} /> Back to Home
      </Link>
      
      <div className="auth-container">
        <AnimatePresence mode="wait">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <motion.div
              key="login"
              className="auth-card"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Please enter your details to sign in.</p>
              </div>

              <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="auth-input-group">
                  <Mail size={20} className="auth-icon" />
                  <input type="email" placeholder="Email Address" required />
                </div>
                
                <div className="auth-input-group">
                  <Lock size={20} className="auth-icon" />
                  <input type="password" placeholder="Password" required />
                </div>
                
                <div className="auth-options">
                  <label className="auth-checkbox">
                    <input type="checkbox" /> Remember me
                  </label>
                  <span className="auth-forgot-link" onClick={() => setView('forgot_request')}>
                    Forgot Password?
                  </span>
                </div>

                <button type="submit" className="auth-btn-primary">
                  Sign In
                </button>
              </form>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div className="auth-social">
                <button className="auth-btn-social">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" height="20" />
                  Sign in with Google
                </button>
              </div>

              <div className="auth-footer">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </div>
            </motion.div>
          )}

          {/* FORGOT PASSWORD - REQUEST OTP */}
          {view === 'forgot_request' && (
            <motion.div
              key="forgot_request"
              className="auth-card"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h2>Forgot Password</h2>
                <p>Enter your email to receive a recovery OTP.</p>
              </div>

              <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setView('forgot_otp'); }}>
                <div className="auth-input-group">
                  <Mail size={20} className="auth-icon" />
                  <input type="email" placeholder="Email Address" required />
                </div>

                <button type="submit" className="auth-btn-primary">
                  Get OTP <MoveRight size={20} style={{marginLeft: '8px'}} />
                </button>
              </form>

              <div className="auth-footer" style={{marginTop: '2rem'}}>
                <span className="auth-forgot-link block-link" onClick={() => setView('login')}>
                  <ChevronLeft size={16} /> Back to Sign In
                </span>
              </div>
            </motion.div>
          )}

           {/* FORGOT PASSWORD - ENTER OTP */}
           {view === 'forgot_otp' && (
            <motion.div
              key="forgot_otp"
              className="auth-card"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h2>Verify OTP</h2>
                <p>We've sent a 6-digit code to your email.</p>
              </div>

              <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setView('forgot_reset'); }}>
                <div className="auth-input-group" style={{justifyContent: 'center', letterSpacing: '4px'}}>
                  <KeyRound size={20} className="auth-icon" />
                  <input 
                    type="text" 
                    placeholder="000000" 
                    maxLength={6} 
                    style={{letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold'}} 
                    required 
                  />
                </div>

                <button type="submit" className="auth-btn-primary">
                  Verify & Continue
                </button>
              </form>

              <div className="auth-footer" style={{marginTop: '2rem'}}>
                <span className="auth-forgot-link block-link" onClick={() => setView('forgot_request')}>
                  Didn't receive it? Resend OTP
                </span>
              </div>
            </motion.div>
          )}

          {/* FORGOT PASSWORD - RESET PASSWORD */}
          {view === 'forgot_reset' && (
            <motion.div
              key="forgot_reset"
              className="auth-card"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h2>Reset Password</h2>
                <p>Enter a new strong password.</p>
              </div>

              <form className="auth-form" onSubmit={(e) => { e.preventDefault(); alert("Password reset successful!"); setView('login'); }}>
                <div className="auth-input-group">
                  <Lock size={20} className="auth-icon" />
                  <input type="password" placeholder="New Password" required />
                </div>
                
                <div className="auth-input-group">
                  <Lock size={20} className="auth-icon" />
                  <input type="password" placeholder="Confirm Password" required />
                </div>

                <button type="submit" className="auth-btn-primary">
                  Update Password
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignInPage;
