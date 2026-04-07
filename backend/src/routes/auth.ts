import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate, signupSchema, loginSchema } from '../lib/validation';

const router = express.Router();

// Cookie configuration
const getCookieConfig = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

// SIGNUP
router.post('/signup', validate(signupSchema), async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) return res.status(400).json({ error: 'User already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        displayName: displayName?.trim(),
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    
    res.cookie('token', token, getCookieConfig());
    res.status(201).json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during signup.' });
  }
});

// LOGIN
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, getCookieConfig());
    res.status(200).json({ user: { id: user.id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully.' });
});

// GET ME (Session check)
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, email: true, displayName: true, plan: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

export default router;
