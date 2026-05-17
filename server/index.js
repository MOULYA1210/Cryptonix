// server/index.js
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import express    from 'express';
import cors       from 'cors';
import connectDB  from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import toolRoutes from './routes/toolRoutes.js';

connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS — allow both local and production ────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,  // We'll set this on Render
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',  authRoutes);
app.use('/api/tools', toolRoutes);

app.get('/', (req, res) => {
  res.json({
    message:   '🛡️ FortiShield API is running!',
    status:    'healthy',
    version:   '1.0.0',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});