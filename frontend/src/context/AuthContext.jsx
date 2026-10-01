import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusfix_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync auth on mount with backend
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // If cookie expired or invalid, clear local user
        if (err.response?.status === 400 || err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('campusfix_user');
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem('campusfix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('campusfix_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
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
