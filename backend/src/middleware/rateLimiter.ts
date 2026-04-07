import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per minute per IP
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limit: 10 requests per minute per IP (prevents brute force)
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many authentication attempts. Please wait a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI/Analysis rate limit: 5 requests per minute per IP (prevents cost abuse)
export const analysisLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'AI analysis rate limit reached. Please wait a minute before requesting another analysis.' },
  standardHeaders: true,
  legacyHeaders: false,
});
