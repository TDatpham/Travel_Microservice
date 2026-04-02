const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = 8080;
const SECRET_KEY = 'your-secret-key';

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // Updated to match properties
  database: 'travel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create users table if not exists
pool.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER',
    avatar LONGTEXT
  )
`, (err) => {
  if (err) console.error('[Auth-Service] Error creating table:', err.message);
  else {
    console.log('[Auth-Service] Table "users" verified');
    // Add default admin if doesn't exist
    pool.execute('INSERT IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
      ['admin@travel.com', 'admin123', 'Administrator', 'ADMIN']);
  }
});

// REGISTER endpoint
app.post('/api/v1/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin (email, password, name)' });
  }

  // Check if user already exists
  pool.execute('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results && results.length > 0) {
      return res.status(409).json({ message: 'Email này đã được sử dụng' });
    }

    // Insert new user
    const sql = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
    pool.execute(sql, [email, password, name, 'USER'], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const accessToken = jwt.sign({ email: email, role: 'USER' }, SECRET_KEY, { expiresIn: '1h' });
      res.status(201).json({
        message: 'Đăng ký thành công!',
        accessToken,
        user: { email, name, role: 'USER', avatar: null }
      });
    });
  });
});

// UPDATE PROFILE endpoint
app.put('/api/v1/auth/update-profile', (req, res) => {
  const { name, email, avatar } = req.body;
  const currentEmail = req.query.currentEmail;

  if (!currentEmail) return res.status(400).json({ message: 'Thiếu currentEmail' });

  pool.execute('UPDATE users SET name = ?, email = ?, avatar = ? WHERE email = ?', [name, email, avatar, currentEmail], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ email, name, role: 'USER', avatar });
  });
});

// LOGIN endpoint
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      const user = results[0];
      const accessToken = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '7d' });
      
      res.json({
        accessToken,
        refreshToken,
        user: { email: user.email, name: user.name, role: user.role, avatar: user.avatar }
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  });
});

app.get('/api/v1/auth/oauth2/success', (req, res) => {
  const token = 'mock-google-token-' + Date.now();
  const email = 'google-user@example.com';
  const name = 'Google User';
  const avatar = 'https://ui-avatars.com/api/?name=Google+User';
  
  const redirectUrl = `http://localhost:3000/signin?token=${token}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}`;
  res.send(`<html><script>window.location.href='${redirectUrl}';</script></html>`);
});

// Mock redirect for Google OAuth2
app.get('/api/v1/auth/google', (req, res) => {
  res.redirect('/api/v1/auth/oauth2/success');
});

// Added callback endpoint provided in USER_REQUEST
app.get('/api/auth/google/callback', (req, res) => {
    res.redirect('/api/v1/auth/oauth2/success');
});

// Alias for compatibility with Spring Boot standard
app.get('/oauth2/authorization/google', (req, res) => {
  res.redirect('http://localhost:8080/api/v1/auth/google');
});

app.listen(PORT, () => {
  console.log(`[Auth-Service] đang chạy tại http://localhost:${PORT}`);
});
