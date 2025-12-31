/**
 * Fake Auth Repository Service
 * 
 * LocalStorage-based authentication repository for development/demo.
 * 
 * SECURITY NOTES:
 * - Uses SHA-256 hashing with per-user salt (derived from immutable user data)
 * - This is CLIENT-SIDE code for DEMO purposes only
 * - Production should NEVER store passwords client-side
 * - Production should use server-side bcrypt/argon2 with proper key derivation
 * 
 * DESIGN:
 * - Each user has a unique salt derived from their immutable ID
 * - Passwords are hashed with: SHA256(salt + password + pepper)
 * - Repository pattern allows easy swap to real backend
 */
import { Injectable } from '@angular/core';
import { UserDto, CreateUserDto } from '../../../sites.app.parts/authentication/users/models/user.dto';
import { DigitalIdentityDto, LinkDigitalIdentityDto } from '../../../sites.app.parts/authentication/digital-identities/models/digital-identity.dto';

/**
 * Email credential (local auth only)
 */
export interface EmailCredential {
  userId: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
  lastChangedAt: string;
  failedAttempts: number;
  lockedUntil: string | null;
}

/**
 * Person stub for demo (minimal)
 */
export interface PersonStub {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

/**
 * Registration request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Login result
 */
export interface LoginResult {
  success: boolean;
  user?: UserDto;
  person?: PersonStub;
  identities?: DigitalIdentityDto[];
  token?: string;
  error?: string;
  lockedUntil?: string;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'fake_auth_users',
  PERSONS: 'fake_auth_persons',
  IDENTITIES: 'fake_auth_identities',
  CREDENTIALS: 'fake_auth_credentials',
  RESET_TOKENS: 'fake_auth_reset_tokens',
};

// Pepper (would be environment-specific in production)
const PEPPER = 'demo-app-pepper-v1';

@Injectable({ providedIn: 'root' })
export class FakeAuthRepository {

  constructor() {
    this.seedDemoData();
  }

  // ============================================
  // Password Hashing
  // ============================================

  /**
   * Generate a unique salt for a user based on immutable data
   * This ensures each user's encryption is different
   */
  private generateSalt(userId: string, email: string): string {
    // Combine immutable user data to create unique salt
    const immutableData = `${userId}:${email.toLowerCase()}:${PEPPER}`;
    return this.simpleHash(immutableData).substring(0, 32);
  }

  /**
   * Hash a password with salt and pepper
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    const data = `${salt}${password}${PEPPER}`;
    return this.sha256(data);
  }

  /**
   * SHA-256 hash using Web Crypto API
   */
  private async sha256(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Simple synchronous hash for salt generation
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  /**
   * Generate a random token
   */
  private generateToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a UUID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ============================================
  // Storage Operations
  // ============================================

  private getStorage<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ============================================
  // User Operations
  // ============================================

  /**
   * Find user by ID
   */
  findUserById(id: string): UserDto | null {
    const users = this.getStorage<UserDto>(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id && !u.deletedAt) || null;
  }

  /**
   * Find user by email (via credentials)
   */
  findUserByEmail(email: string): UserDto | null {
    const credentials = this.getStorage<EmailCredential>(STORAGE_KEYS.CREDENTIALS);
    const cred = credentials.find(c => c.email.toLowerCase() === email.toLowerCase());
    if (!cred) return null;
    return this.findUserById(cred.userId);
  }

  /**
   * Find user by external identity
   */
  findUserByExternalIdentity(providerId: string, externalUserId: string): UserDto | null {
    const identities = this.getStorage<DigitalIdentityDto>(STORAGE_KEYS.IDENTITIES);
    const identity = identities.find(
      i => i.providerId === providerId && i.externalUserId === externalUserId && i.enabled
    );
    if (!identity) return null;
    return this.findUserById(identity.userId);
  }

  // ============================================
  // Authentication
  // ============================================

  /**
   * Validate email/password login
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const credentials = this.getStorage<EmailCredential>(STORAGE_KEYS.CREDENTIALS);
    const cred = credentials.find(c => c.email.toLowerCase() === email.toLowerCase());

    if (!cred) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Check lockout
    if (cred.lockedUntil && new Date(cred.lockedUntil) > new Date()) {
      return { 
        success: false, 
        error: 'Account is temporarily locked', 
        lockedUntil: cred.lockedUntil 
      };
    }

    // Verify password
    const hash = await this.hashPassword(password, cred.salt);
    if (hash !== cred.passwordHash) {
      // Increment failed attempts
      cred.failedAttempts++;
      if (cred.failedAttempts >= 5) {
        cred.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      this.setStorage(STORAGE_KEYS.CREDENTIALS, credentials);
      return { success: false, error: 'Invalid email or password' };
    }

    // Reset failed attempts
    cred.failedAttempts = 0;
    cred.lockedUntil = null;
    this.setStorage(STORAGE_KEYS.CREDENTIALS, credentials);

    // Get user data
    const user = this.findUserById(cred.userId);
    if (!user || !user.enabled) {
      return { success: false, error: 'Account is disabled' };
    }

    const person = this.findPersonById(user.personId);
    const identities = this.findIdentitiesByUserId(user.id);
    const token = this.generateToken();

    return {
      success: true,
      user,
      person: person || undefined,
      identities,
      token
    };
  }

  /**
   * Register new user with email/password
   */
  async register(request: RegisterRequest): Promise<LoginResult> {
    // Check if email exists
    const existing = this.findUserByEmail(request.email);
    if (existing) {
      return { success: false, error: 'Email already registered' };
    }

    const now = new Date().toISOString();
    const personId = this.generateId();
    const userId = this.generateId();

    // Create person
    const person: PersonStub = {
      id: personId,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      createdAt: now
    };

    // Create user
    const user: UserDto = {
      id: userId,
      personId: personId,
      enabled: true,
      validFrom: null,
      validTo: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };

    // Create email identity
    const identity: DigitalIdentityDto = {
      id: this.generateId(),
      userId: userId,
      providerId: 'email',
      externalUserId: request.email.toLowerCase(),
      externalEmail: request.email,
      externalDisplayName: `${request.firstName} ${request.lastName}`,
      linkedAt: now,
      lastAuthenticatedAt: now,
      enabled: true,
      isPrimary: true
    };

    // Create credentials
    const salt = this.generateSalt(userId, request.email);
    const passwordHash = await this.hashPassword(request.password, salt);
    const credential: EmailCredential = {
      userId: userId,
      email: request.email.toLowerCase(),
      passwordHash,
      salt,
      createdAt: now,
      lastChangedAt: now,
      failedAttempts: 0,
      lockedUntil: null
    };

    // Save all
    const persons = this.getStorage<PersonStub>(STORAGE_KEYS.PERSONS);
    const users = this.getStorage<UserDto>(STORAGE_KEYS.USERS);
    const identities = this.getStorage<DigitalIdentityDto>(STORAGE_KEYS.IDENTITIES);
    const credentials = this.getStorage<EmailCredential>(STORAGE_KEYS.CREDENTIALS);

    persons.push(person);
    users.push(user);
    identities.push(identity);
    credentials.push(credential);

    this.setStorage(STORAGE_KEYS.PERSONS, persons);
    this.setStorage(STORAGE_KEYS.USERS, users);
    this.setStorage(STORAGE_KEYS.IDENTITIES, identities);
    this.setStorage(STORAGE_KEYS.CREDENTIALS, credentials);

    return {
      success: true,
      user,
      person,
      identities: [identity],
      token: this.generateToken()
    };
  }

  /**
   * Link external identity to existing user
   */
  linkExternalIdentity(userId: string, request: LinkDigitalIdentityDto): DigitalIdentityDto | null {
    const user = this.findUserById(userId);
    if (!user) return null;

    const now = new Date().toISOString();
    const identity: DigitalIdentityDto = {
      id: this.generateId(),
      userId: userId,
      providerId: request.providerId,
      externalUserId: request.externalUserId,
      externalEmail: request.externalEmail || null,
      externalDisplayName: request.externalDisplayName || null,
      linkedAt: now,
      lastAuthenticatedAt: now,
      enabled: true,
      isPrimary: request.isPrimary || false
    };

    const identities = this.getStorage<DigitalIdentityDto>(STORAGE_KEYS.IDENTITIES);
    identities.push(identity);
    this.setStorage(STORAGE_KEYS.IDENTITIES, identities);

    return identity;
  }

  // ============================================
  // Password Reset
  // ============================================

  /**
   * Request password reset (generates token)
   */
  requestPasswordReset(email: string): { success: boolean; token?: string; error?: string } {
    const user = this.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return { success: true };
    }

    const token = this.generateToken();
    const resetTokens = this.getStorage<{ email: string; token: string; expiresAt: string }>(
      STORAGE_KEYS.RESET_TOKENS
    );

    // Remove existing tokens for this email
    const filtered = resetTokens.filter(t => t.email !== email.toLowerCase());
    
    // Add new token (expires in 1 hour)
    filtered.push({
      email: email.toLowerCase(),
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    });

    this.setStorage(STORAGE_KEYS.RESET_TOKENS, filtered);

    // In demo, we return the token. In production, this would be emailed.
    console.log(`[DEMO] Password reset token for ${email}: ${token}`);
    return { success: true, token };
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const resetTokens = this.getStorage<{ email: string; token: string; expiresAt: string }>(
      STORAGE_KEYS.RESET_TOKENS
    );

    const resetRequest = resetTokens.find(t => t.token === token);
    if (!resetRequest) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    if (new Date(resetRequest.expiresAt) < new Date()) {
      return { success: false, error: 'Reset token has expired' };
    }

    // Find and update credentials
    const credentials = this.getStorage<EmailCredential>(STORAGE_KEYS.CREDENTIALS);
    const cred = credentials.find(c => c.email === resetRequest.email);
    if (!cred) {
      return { success: false, error: 'Account not found' };
    }

    // Update password
    cred.passwordHash = await this.hashPassword(newPassword, cred.salt);
    cred.lastChangedAt = new Date().toISOString();
    cred.failedAttempts = 0;
    cred.lockedUntil = null;

    this.setStorage(STORAGE_KEYS.CREDENTIALS, credentials);

    // Remove used token
    this.setStorage(
      STORAGE_KEYS.RESET_TOKENS,
      resetTokens.filter(t => t.token !== token)
    );

    return { success: true };
  }

  // ============================================
  // Helper Methods
  // ============================================

  findPersonById(id: string): PersonStub | null {
    const persons = this.getStorage<PersonStub>(STORAGE_KEYS.PERSONS);
    return persons.find(p => p.id === id) || null;
  }

  findIdentitiesByUserId(userId: string): DigitalIdentityDto[] {
    const identities = this.getStorage<DigitalIdentityDto>(STORAGE_KEYS.IDENTITIES);
    return identities.filter(i => i.userId === userId && i.enabled);
  }

  // ============================================
  // Demo Data Seeding
  // ============================================

  private async seedDemoData(): Promise<void> {
    // Only seed if no data exists
    const users = this.getStorage<UserDto>(STORAGE_KEYS.USERS);
    if (users.length > 0) return;

    console.log('[FakeAuthRepository] Seeding demo data...');

    // Create demo user
    await this.register({
      email: 'admin@themesbrand.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'User'
    });

    // Create another demo user
    await this.register({
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'Account'
    });

    console.log('[FakeAuthRepository] Demo data seeded');
  }

  /**
   * Clear all data (for testing)
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}
