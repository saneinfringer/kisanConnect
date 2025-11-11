// server/src/index.js
const dotenv = require('dotenv');
dotenv.config(); // must run before other modules that read process.env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cropRoutes = require('./routes/cropRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// quick sanity checks
if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI not set. Make sure your .env contains MONGODB_URI.');
}
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set. Authentication will fail without it.');
}

console.log('Using CORS_ORIGIN:', process.env.CORS_ORIGIN || 'http://localhost:3000');
console.log('Mongo URI:', process.env.MONGODB_URI || '(not set)');

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/crops', cropRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// error handler - placed after routes (Express will call this when next(err) used)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err?.status || 500).json({ message: err?.message || 'Internal Server Error' });
});

// DB connect and start
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// global handlers to log uncaught problems (optional but helpful)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
