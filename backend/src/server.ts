import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import apiRoutes from './routes/apiRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'NEXUS TypeScript E-Commerce REST API',
    version: '2.0.0-TS',
    architecture: 'Abstract Factory Pattern (Database, Payments, Notifications)',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 NEXUS TypeScript Backend running at: http://localhost:${PORT}`);
  console.log(`📑 API Documentation / Status at: http://localhost:${PORT}/api`);
  console.log('========================================================');
});
