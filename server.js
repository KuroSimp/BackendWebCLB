const express = require('express');      // ← thêm dòng này
const app = express();                   // ← và dòng này
const pool = require('./db');

app.use(express.json());                // ← nếu muốn dùng body json

// API
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi truy vấn database' });
  }
});

app.post('/api/members', async (req, res) => {
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
