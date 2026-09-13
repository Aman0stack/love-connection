import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import photoRoutes from './routes/photos.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Forever & Always Love API',
  });
});

// Serve frontend build in production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function startServer() {
  connectDB().catch((err) => {
    console.warn('[MongoDB Atlas] Initial connection pending or IP whitelist required (0.0.0.0/0). Resilient fallback store active.');
  });
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Love Server] Backend API listening on http://localhost:${PORT}`);
  });
}

startServer();
