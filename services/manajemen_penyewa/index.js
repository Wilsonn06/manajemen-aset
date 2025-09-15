const express = require('express');
const router = express.Router();
const db = require('../../db');
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Pengguna WHERE role = 'penyewa'");
    res.json(rows);
  } catch (err) {
    console.error('Error mengambil data:', err.message);
    res.status(500).json({ message: 'Gagal mengambil data' });
  }
});

// POST tambah pengguna baru
router.post('/', async (req, res) => {
  const { nama_pengguna, role, pass, telp_pengguna, rekening, status_sewa, id_properti } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Pengguna (nama_pengguna, role, pass, telp_pengguna, rekening, status_sewa, id_properti)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama_pengguna, role, pass, telp_pengguna, rekening, status_sewa || false, id_properti || null]
    );

    res.status(201).json({ message: 'Pengguna berhasil ditambahkan', id_pengguna: result.insertId });
  } catch (err) {
    console.error('Error menambahkan pengguna:', err.message);
    res.status(500).json({ message: 'Gagal menambahkan pengguna' });
  }
});

// PUT edit pengguna berdasarkan id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama_pengguna, role, pass, telp_pengguna, rekening, status_sewa, id_properti } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE Pengguna 
       SET nama_pengguna = ?, role = ?, pass = ?, telp_pengguna = ?, rekening = ?, status_sewa = ?, id_properti = ?
       WHERE id_pengguna = ?`,
      [nama_pengguna, role, pass, telp_pengguna, rekening, status_sewa, id_properti, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.json({ message: 'Pengguna berhasil diperbarui' });
  } catch (err) {
    console.error('Error mengedit pengguna:', err.message);
    res.status(500).json({ message: 'Gagal mengedit pengguna' });
  }
});

// DELETE hapus pengguna berdasarkan id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(`DELETE FROM Pengguna WHERE id_pengguna = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    console.error('Error menghapus pengguna:', err.message);
    res.status(500).json({ message: 'Gagal menghapus pengguna' });
  }
});

module.exports = router;
