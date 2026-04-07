import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import decisionRoutes from './routes/decisions';
import analysisRoutes from './routes/analysis';
import statsRoutes from './routes/stats';
import stripeRoutes from './routes/stripe';
import { generalLimiter, authLimiter, analysisLimiter } from './middleware/rateLimiter';

const app = express();

// Security headers
app.use(helmet());

// Request logging
app.use(morgan('dev'));

// CORS — explicit origin from env
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Stripe webhook needs raw body for signature verification
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Global rate limiter
app.use('/api', generalLimiter);

// Routes with specific rate limits
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/analysis', analysisLimiter, analysisRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/stripe', stripeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.send('MindLedger API is running. Check /health for status.');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

export default app;
