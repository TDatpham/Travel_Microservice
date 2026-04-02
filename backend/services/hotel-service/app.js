const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root', // Based on docker-compose default
  database: 'travel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create table if not exists (Basic schema)
pool.execute(`
  CREATE TABLE IF NOT EXISTS hotels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2),
    rating DECIMAL(5, 2),
    description TEXT,
    type VARCHAR(100),
    imageUrl LONGTEXT
  )
`, (err) => {
  if (err) console.error('[Hotel-Service] Error creating table:', err.message);
  else {
    console.log('[Hotel-Service] Table "hotels" verified');
    // Seed data if empty
    pool.query('SELECT COUNT(*) as count FROM hotels', (err, results) => {
      if (!err && results[0].count === 0) {
        const initialHotels = JSON.parse(fs.readFileSync(path.join(__dirname, 'hotels.json'), 'utf8'));
        initialHotels.forEach(h => {
          pool.execute('INSERT INTO hotels (name, location, price, rating, type, imageUrl) VALUES (?, ?, ?, ?, ?, ?)', 
            [h.name, h.location, h.price, h.rating, h.type, h.imageUrl]);
        });
        console.log('[Hotel-Service] Seeded initial data');
      }
    });
  }
});

app.get('/api/v1/hotels', (req, res) => {
  pool.query('SELECT * FROM hotels', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/v1/hotels', (req, res) => {
  const { name, location, price, rating, description, type, imageUrl } = req.body;
  const sql = 'INSERT INTO hotels (name, location, price, rating, description, type, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.execute(sql, [name, location, price, rating, description, type, imageUrl], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

app.listen(PORT, () => {
  console.log(`[Hotel-Service] đang chạy tại http://localhost:${PORT}`);
});
