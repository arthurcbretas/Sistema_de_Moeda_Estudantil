import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sme-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('sme-user');
        localStorage.removeItem('sme-token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('sme-token', token);
    localStorage.setItem('sme-user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sme-token');
    localStorage.removeItem('sme-user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('sme-token');

  const hasRole = (...roles) => user && roles.includes(user.role);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
