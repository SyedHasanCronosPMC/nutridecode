import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AuthState, User, LoginCredentials } from '../types/auth';
import { getEnvVar } from '../utils/env';
import { loginWithGoogleToken } from '../services/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null };
    case 'AUTH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      // In a real app, make an API call to your backend
      throw new Error('Email/Password login not implemented in demo');
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Load the Google client library
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = resolve;
        document.body.appendChild(script);
      });

      // Initialize Google client
      const client = google.accounts.oauth2.initTokenClient({
        client_id: getEnvVar('GOOGLE_CLIENT_ID'),
        scope: 'email profile',
        callback: async (response) => {
          if (response.error) {
            throw new Error(response.error);
          }

          try {
            const { user, token } = await loginWithGoogleToken(response.access_token);
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            localStorage.setItem('auth_token', token);
          } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
          }
        },
      });

      client.requestAccessToken();
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Google login failed' });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('auth_token');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};