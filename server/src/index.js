const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cropRoutes = require('./routes/cropRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

dotenv.config();
console.log("Mongo URI:", process.env.MONGODB_URI);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/crops', cropRoutes);
app.use('/api/users', userRoutes);
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});