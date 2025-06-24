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

// KHỞI CHẠY SERVER ← bắt buộc!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại cổng ${PORT}`);
});

