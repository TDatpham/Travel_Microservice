import React from 'react';

const Footer = ({ className = "" }) => {
  return (
    <footer className={className}>
      <div className="container">
        <div className="footer-sections">
          <div className="footer-section">
            <div className="logo-wrapper" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              fontFamily: 'Poppins, sans-serif',
              marginBottom: '1.5rem'
            }}>
              <img src="/Imgs/Logo/icon.svg" alt="Icon" style={{ height: '32px' }} />
              <span style={{ 
                fontSize: '24px', 
                fontWeight: '800', 
                color: '#111',
                letterSpacing: '-0.5px'
              }}>
                Travel
              </span>
            </div>
            <p>We always make our customers happy by providing as many choices as possible</p>
            <div className="footer-social-icons">
              <img src="/Imgs/icons/facebook.png" alt="" />
              <img src="/Imgs/icons/twitter.png" alt="" />
              <img src="/Imgs/icons/instagram.png" alt="" />
            </div>
          </div>

          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li><a href="">About Us</a></li>
              <li><a href="">Features</a></li>
              <li><a href="">News</a></li>
              <li><a href="">Menu</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="">why Travel</a></li>
              <li><a href="">Partner with us</a></li>
              <li><a href="">FAQ</a></li>
              <li><a href="">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="">Account</a></li>
              <li><a href="">Support Center</a></li>
              <li><a href="">Feedback</a></li>
              <li><a href="">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Subscribe on our destination review <br /> newsletters</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-section">
                <img src="/Imgs/icons/messagefooter.png" alt="" />
                <label htmlFor="email"> Your Email
                  <input type="email" id="email" name="email" placeholder="exp - abc@gmail.com " />
                </label>
              </div>
              <button type="submit">
                <img src="/Imgs/icons/arrowleft.png" alt="" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
