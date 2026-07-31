// Simple password hashing using Node.js crypto
// For production, use bcrypt - this is a demo/educational implementation

import { createHash } from 'crypto';

export function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'portfolio_salt_2024').digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
