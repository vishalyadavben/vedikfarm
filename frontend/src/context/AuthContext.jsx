import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem('vf_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await client.get('/api/auth/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('vf_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  async function login(email, password) {
    const res = await client.post('/api/auth/login', { email, password });
    localStorage.setItem('vf_token', res.data.accessToken);
    setUser({ id: res.data.userId, email: res.data.email, name: res.data.name, role: res.data.role });
  }

  async function register(payload) {
    const res = await client.post('/api/auth/register', payload);
    localStorage.setItem('vf_token', res.data.accessToken);
    setUser({ id: res.data.userId, email: res.data.email, name: res.data.name, role: res.data.role });
  }

  function logout() {
    localStorage.removeItem('vf_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
