import bcrypt from 'bcrypt';
import { UserService } from './userService.js';
import { generateToken } from '../utils/jwt.js';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.js';
import { AuthError, ValidationError } from '../utils/errors.js';
import { GoogleAuthService } from './googleAuthService.js';
import { SessionService } from './sessionService.js';

export class AuthService {
  static async loginWithGoogle(token: string): Promise<AuthResponse> {
    const googleAuth = await GoogleAuthService.verifyToken(token);
    const user = await UserService.upsertGoogleUser(googleAuth);
    const authToken = generateToken({ userId: user.id });
    await SessionService.createSession(user.id, authToken);
    return { token: authToken, user };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await UserService.findByEmail(data.email);
    if (!user?.password_hash) {
      throw new AuthError('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!validPassword) {
      throw new AuthError('Invalid credentials');
    }

    const token = generateToken({ userId: user.id });
    await SessionService.createSession(user.id, token);
    
    const { password_hash, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await UserService.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await UserService.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
    });

    const token = generateToken({ userId: user.id });
    await SessionService.createSession(user.id, token);
    return { token, user };
  }

  static async logout(token: string): Promise<void> {
    await SessionService.invalidateSession(token);
  }
}