const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET semua stok
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Stok');
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data stok:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data stok' });
  }
});

// GET stok by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Stok WHERE id_stok = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Stok tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error mengambil stok:', err.message);
    res.status(500).json({ message: 'Gagal mengambil stok' });
  }
});

// POST tambah stok
router.post('/', async (req, res) => {
  const { nama_stok, kondisi_stok } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Stok (nama_stok, kondisi_stok) VALUES (?, ?)`,
      [nama_stok, kondisi_stok]
    );

    res.status(201).json({ message: 'Stok berhasil ditambahkan', id_stok: result.insertId });
  } catch (err) {
    console.error('Error menambahkan stok:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan stok' });
  }
});

// PUT edit stok
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_stok, kondisi_stok } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Stok SET nama_stok = ?, kondisi_stok = ? WHERE id_stok = ?`,
      [nama_stok, kondisi_stok, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Stok tidak ditemukan' });
    }

    res.json({ message: 'Stok berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit stok:', err.message);
    res.status(500).json({ message: 'Gagal mengedit stok' });
  }
});

// DELETE hapus stok
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Stok WHERE id_stok = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Stok tidak ditemukan' });
    }

    res.json({ message: 'Stok berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus stok:', err.message);
    res.status(500).json({ message: 'Gagal menghapus stok' });
  }
});


//
// ---------- RELASI PROPERTI-STOK ----------
//

// GET semua stok milik properti tertentu
router.get('/properti/:id_properti', async (req, res) => {
  const { id_properti } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT s.id_stok, s.nama_stok, s.kondisi_stok, ps.lokasi_stok, ps.jumlah
       FROM Properti_Stok ps
       JOIN Stok s ON ps.id_stok = s.id_stok
       WHERE ps.id_properti = ?`,
      [id_properti]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil stok properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil stok properti' });
  }
});

// POST tambah stok ke properti
router.post('/properti/:id_properti/:id_stok', async (req, res) => {
  const { id_properti, id_stok } = req.params;
  const { lokasi_stok, jumlah } = req.body;

  try {
    await db.query(
      `INSERT INTO Properti_Stok (id_properti, id_stok, lokasi_stok, jumlah) VALUES (?, ?, ?, ?)`,
      [id_properti, id_stok, lokasi_stok, jumlah || 1]
    );
    res.status(201).json({ message: 'Stok berhasil ditambahkan ke properti' });
  } catch (err) {
    console.error('Error menambahkan stok ke properti:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan stok ke properti' });
  }
});

// PUT update stok di properti (lokasi/jumlah)
router.put('/properti/:id_properti/:id_stok', async (req, res) => {
  const { id_properti, id_stok } = req.params;
  const { lokasi_stok, jumlah } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Properti_Stok SET lokasi_stok = ?, jumlah = ? 
       WHERE id_properti = ? AND id_stok = ?`,
      [lokasi_stok, jumlah, id_properti, id_stok]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Relasi stok-properti tidak ditemukan' });
    }

    res.json({ message: 'Stok properti berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengupdate stok properti:', err.message);
    res.status(500).json({ message: 'Gagal mengupdate stok properti' });
  }
});

// DELETE hapus stok dari properti
router.delete('/properti/:id_properti/:id_stok', async (req, res) => {
  const { id_properti, id_stok } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM Properti_Stok WHERE id_properti = ? AND id_stok = ?',
      [id_properti, id_stok]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Relasi stok-properti tidak ditemukan' });
    }

    res.json({ message: 'Stok berhasil dihapus dari properti' });
  } catch (err) {
    console.error('Error menghapus stok dari properti:', err.message);
    res.status(500).json({ message: 'Gagal menghapus stok dari properti' });
  }
});

module.exports = router;
