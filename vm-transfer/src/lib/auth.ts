import { apiRequest, queryClient } from "./queryClient";
import type { User, InsertUser } from "@shared/schema";

export interface AuthResponse {
  user: User;
  token?: string;
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(userData: InsertUser): Promise<AuthResponse> {
    try {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      const user = await response.json();
      
      this.currentUser = user;
      queryClient.setQueryData(['auth', 'user'], user);
      return { user };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      const user = await response.json();
      
      this.currentUser = user;
      queryClient.setQueryData(['auth', 'user'], user);
      return { user };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    queryClient.setQueryData(['auth', 'user'], null);
    queryClient.clear();
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await apiRequest('GET', '/api/auth/user');
      const user = await response.json();
      this.currentUser = user;
      queryClient.setQueryData(['auth', 'user'], user);
      return user;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getUser(): User | null {
    return this.currentUser;
  }
}

export const authService = AuthService.getInstance();