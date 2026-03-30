import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="page-content">
      <div className="container">
        <motion.div
          className="contact-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title" style={{ marginTop: '6rem' }}>Contact Us</h2>

          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <div className="contact-info-item">
                <span className="contact-info-icon">📍</span>
                <div>
                  <h4>Address</h4>
                  <p>123 Travel Street, World City</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 000-0000</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-icon">✉️</span>
                <div>
                  <h4>Email</h4>
                  <p>hello@travel.com</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent ? (
                <div className="contact-success">
                  <span>✅</span>
                  <h3>Message sent! We'll get back to you soon.</h3>
                </div>
              ) : (
                <>
                  <div className="contact-form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                  />
                  <textarea
                    name="message"
                    placeholder="Your message..."
                    rows="6"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit" className="contact-submit">
                    Send Message <span>→</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
