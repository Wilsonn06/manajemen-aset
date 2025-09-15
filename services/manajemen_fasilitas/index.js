const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET semua fasilitas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Fasilitas');
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data fasilitas:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data fasilitas' });
  }
});

// GET fasilitas by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Fasilitas WHERE id_fasilitas = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error mengambil fasilitas:', err.message);
    res.status(500).json({ message: 'Gagal mengambil fasilitas' });
  }
});

// POST tambah fasilitas
router.post('/', async (req, res) => {
  const { nama_fasilitas, kondisi_fasilitas, lokasi_fasilitas } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Fasilitas (nama_fasilitas, kondisi_fasilitas, lokasi_fasilitas)
       VALUES (?, ?, ?)`,
      [nama_fasilitas, kondisi_fasilitas, lokasi_fasilitas]
    );

    res.status(201).json({ message: 'Fasilitas berhasil ditambahkan', id_fasilitas: result.insertId });
  } catch (err) {
    console.error('Error menambahkan fasilitas:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan fasilitas' });
  }
});

// PUT edit fasilitas
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_fasilitas, kondisi_fasilitas, lokasi_fasilitas } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Fasilitas 
       SET nama_fasilitas = ?, kondisi_fasilitas = ?, lokasi_fasilitas = ?
       WHERE id_fasilitas = ?`,
      [nama_fasilitas, kondisi_fasilitas, lokasi_fasilitas, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
    }

    res.json({ message: 'Fasilitas berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit fasilitas:', err.message);
    res.status(500).json({ message: 'Gagal mengedit fasilitas' });
  }
});

// DELETE hapus fasilitas
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Fasilitas WHERE id_fasilitas = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Fasilitas tidak ditemukan' });
    }

    res.json({ message: 'Fasilitas berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus fasilitas:', err.message);
    res.status(500).json({ message: 'Gagal menghapus fasilitas' });
  }
});


// ---------------- RELASI PROPERTI-FASILITAS ---------------- //

// GET semua fasilitas milik properti tertentu
router.get('/properti/:id_properti', async (req, res) => {
  const { id_properti } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT f.id_fasilitas, f.nama_fasilitas, f.kondisi_fasilitas, f.lokasi_fasilitas
       FROM Properti_Fasilitas pf
       JOIN Fasilitas f ON pf.id_fasilitas = f.id_fasilitas
       WHERE pf.id_properti = ?`,
      [id_properti]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil fasilitas properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil fasilitas properti' });
  }
});

// POST tambah fasilitas ke properti
router.post('/properti/:id_properti/:id_fasilitas', async (req, res) => {
  const { id_properti, id_fasilitas } = req.params;
  try {
    await db.query(
      'INSERT INTO Properti_Fasilitas (id_properti, id_fasilitas) VALUES (?, ?)',
      [id_properti, id_fasilitas]
    );
    res.status(201).json({ message: 'Fasilitas berhasil ditambahkan ke properti' });
  } catch (err) {
    console.error('Error menambahkan fasilitas ke properti:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan fasilitas ke properti' });
  }
});

// DELETE hapus fasilitas dari properti
router.delete('/properti/:id_properti/:id_fasilitas', async (req, res) => {
  const { id_properti, id_fasilitas } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM Properti_Fasilitas WHERE id_properti = ? AND id_fasilitas = ?',
      [id_properti, id_fasilitas]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Relasi fasilitas-properti tidak ditemukan' });
    }

    res.json({ message: 'Fasilitas berhasil dihapus dari properti' });
  } catch (err) {
    console.error('Error menghapus fasilitas dari properti:', err.message);
    res.status(500).json({ message: 'Gagal menghapus fasilitas dari properti' });
  }
});

module.exports = router;
