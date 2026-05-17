// server/index.js
import * as dotenv from 'dotenv';
dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI);

import express    from 'express';
import cors       from 'cors';
import connectDB  from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';

// Connect to MongoDB
connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ───────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ROUTES ───────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/tools', toolRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message:   '🛡️ FortiShield API is running!',
    status:    'healthy',
    version:   '1.0.0',
    endpoints: {
      auth:  '/api/auth',
      tools: '/api/tools',
    },
  });
});

// ─── 404 HANDLER ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── START SERVER ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});