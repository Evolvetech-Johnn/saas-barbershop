import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '@/types/usuario';
import { authService } from '@/services/authService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTenant } from './TenantContext';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useLocalStorage<Usuario | null>('usuario', null);
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenant();

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    try {
      const currentTenantId = tenant ? (tenant.id || (tenant as any)._id) : undefined;
      const response = await authService.login(email, senha, currentTenantId ? String(currentTenantId) : undefined);
      setUsuario(response.user);
    } catch (err) {
      console.error('Erro no login:', err);
      setLoading(false);
      return false;
    }
    setLoading(false);
    return true;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
