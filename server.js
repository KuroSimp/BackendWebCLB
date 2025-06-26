const express = require('express');      // ← thêm dòng này
const app = express();      
const cors = require('cors');
app.use(cors());

app.use(express.json());                // ← nếu muốn dùng body json
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

if (require.main === module) {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Kết nối database thất bại:', err);
    } else {
      console.log('Kết nối database thành công! Thời gian:', res.rows[0].now);
    }
  });
}

// API
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi truy vấn database' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, phone, reason } = req.body;
  if (!name || !email || !phone || !reason) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO members (name, email, phone, reason) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi đăng ký member' });
  }
});

// KHỞI CHẠY SERVER ← bắt buộc!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại cổng ${PORT}`);
});
