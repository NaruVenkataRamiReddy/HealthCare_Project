// Authentication service - Connects to backend API

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  role: 'PATIENT' | 'DOCTOR' | 'DIAGNOSTICS' | 'SHOP';
  name: string;
  email: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

/**
 * Login user - Connects to real backend API
 */
export const mockLogin = async (credentials: LoginCredentials, role: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid username or password');
    }

    // Store token in localStorage
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
    }

    // Return user data
    return {
      id: data.data.userId,
      role: data.data.role,
      name: data.data.name || data.data.profile?.name,
      email: data.data.email,
      ...data.data.profile,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Invalid username or password');
  }
};

/**
 * Register user - Connects to real backend API
 */
export const mockRegister = async (userData: any, role: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: role.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
    }

    return {
      id: data.data.userId,
      role: data.data.role,
      name: data.data.name,
      email: data.data.email,
      ...userData,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      localStorage.removeItem('token');
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};