const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/manajemen_stok', require('./services/manajemen_stok'));
app.use('/manajemen_properti', require('./services/manajemen_properti'));
app.use('/manajemen_fasilitas', require('./services/manajemen_fasilitas'));
app.use('/manajemen_penyewa', require('./services/manajemen_penyewa'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
