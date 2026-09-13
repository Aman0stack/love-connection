import jwt from 'jsonwebtoken';
import { dbService } from '../services/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'forever_and_always_love_token_2026';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please log in to perform this action' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbService.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await dbService.findUserById(decoded.id);
    }
  } catch (err) {
    // Ignore invalid token in optionalAuth
  }
  next();
}
