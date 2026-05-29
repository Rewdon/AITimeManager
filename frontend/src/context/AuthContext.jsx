import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return (t && t !== 'undefined') ? t : null;
  });
  const [loading, setLoading] = useState(true);
  const { info, error } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          error('Sesja wygasła. Zaloguj się ponownie.');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, error]);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    info('Zostałeś pomyślnie wylogowany.');
  };

  const value = { user, token, login, logout, loading };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="text-text-muted text-sm font-medium">Uwierzytelnianie...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);