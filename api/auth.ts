import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { users, emailVerifications, passwordResets } from '@shared/schema';
import { db } from './db';
import { eq, and, gt } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified: boolean;
  };
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function generateRandomToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isEmailVerified: user.isEmailVerified || false,
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

export async function requireEmailVerification(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({ 
      message: 'Email verification required',
      emailVerified: false 
    });
  }
  next();
}

export async function createEmailVerificationToken(email: string): Promise<string> {
  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await db.insert(emailVerifications).values({
    email,
    token,
    expiresAt,
  });

  return token;
}

export async function createPasswordResetToken(email: string): Promise<string> {
  const token = generateRandomToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Delete any existing tokens for this email
  await db.delete(passwordResets).where(eq(passwordResets.email, email));

  await db.insert(passwordResets).values({
    email,
    token,
    expiresAt,
  });

  return token;
}

export async function verifyEmailToken(token: string): Promise<string | null> {
  const [verification] = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.token, token),
        gt(emailVerifications.expiresAt, new Date())
      )
    );

  if (!verification) {
    return null;
  }

  // Mark user as verified
  await db
    .update(users)
    .set({ 
      isEmailVerified: true,
      updatedAt: new Date()
    })
    .where(eq(users.email, verification.email));

  // Delete the verification token
  await db.delete(emailVerifications).where(eq(emailVerifications.token, token));

  return verification.email;
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.token, token),
        gt(passwordResets.expiresAt, new Date())
      )
    );

  return reset ? reset.email : null;
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const email = await verifyPasswordResetToken(token);
  if (!email) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);
  
  await db
    .update(users)
    .set({ 
      password: hashedPassword,
      updatedAt: new Date()
    })
    .where(eq(users.email, email));

  // Delete the reset token
  await db.delete(passwordResets).where(eq(passwordResets.token, token));

  return true;
}