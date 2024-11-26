import { getEnvVar } from '../utils/env';
import { LoginCredentials } from '../types/auth';

const API_URL = 'http://localhost:3000/api';

export async function loginWithGoogleToken(token: string) {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Authentication failed');
  }

  return response.json();
}

export async function loginWithCredentials(credentials: LoginCredentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Authentication failed');
  }

  return response.json();
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
}) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function fetchUserProfile() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/protected/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      throw new Error('Session expired');
    }
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

export async function checkSession() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/protected/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    return response.ok;
  } catch {
    return false;
  }
}