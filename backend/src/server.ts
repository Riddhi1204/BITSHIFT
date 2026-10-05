import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import governmentRoutes from './routes/governmentRoutes.js';
import citizenRoutes from './routes/citizenRoutes.js';
import bloodRequestRoutes from './routes/bloodRequestRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import prisma from './lib/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    // Quick test of database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'HemoVite backend is running and connected to PostgreSQL',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: 'HemoVite backend running, but database connection failed',
      error: err.message,
    });
  }
});

// Mount Routes
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/blood-banks', bloodBankRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/citizens', citizenRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/inventory', inventoryRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`🩸 HemoVite Backend Server running on:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});

export default app;
