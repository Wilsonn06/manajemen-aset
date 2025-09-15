const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET semua properti
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Properti');
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data properti' });
  }
});

// GET properti by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Properti WHERE id_properti = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Properti tidak ditemukan' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error mengambil properti:', err.message);
    res.status(500).json({ message: 'Gagal mengambil properti' });
  }
});

// POST tambah properti baru
router.post('/', async (req, res) => {
  const { nama_properti, tipe_properti, alamat_properti, deskripsi_properti, status_properti, telp_properti } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Properti (nama_properti, tipe_properti, alamat_properti, deskripsi_properti, status_properti, telp_properti)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_properti, tipe_properti, alamat_properti, deskripsi_properti, status_properti || '', telp_properti]
    );

    res.status(201).json({ message: 'Properti berhasil ditambahkan', id_properti: result.insertId });
  } catch (err) {
    console.error('Error menambahkan properti:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan properti' });
  }
});

// PUT edit properti
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_properti, tipe_properti, alamat_properti, deskripsi_properti, status_properti, telp_properti } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Properti 
       SET nama_properti = ?, tipe_properti = ?, alamat_properti = ?, deskripsi_properti = ?, status_properti = ?, telp_properti = ?
       WHERE id_properti = ?`,
      [nama_properti, tipe_properti, alamat_properti, deskripsi_properti, status_properti, telp_properti, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Properti tidak ditemukan' });
    }

    res.json({ message: 'Properti berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit properti:', err.message);
    res.status(500).json({ message: 'Gagal mengedit properti' });
  }
});

// DELETE hapus properti
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM Properti WHERE id_properti = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Properti tidak ditemukan' });
    }

    res.json({ message: 'Properti berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus properti:', err.message);
    res.status(500).json({ message: 'Gagal menghapus properti' });
  }
});

module.exports = router;
