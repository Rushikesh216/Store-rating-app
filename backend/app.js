const express = require('express');
const cors = require('cors');
require('dotenv').config();
const storeRoutes = require('./routes/storeRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes'); 
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/stores', storeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));