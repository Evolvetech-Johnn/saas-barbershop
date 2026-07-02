import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';

export const Topbar: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast('Você foi desconectado!', 'info');
    navigate('/app/login');
  };

  return (
    <header className="h-16 bg-base-900 border-b border-base-800 flex items-center justify-between px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button className="p-2 text-support-300 hover:text-support-100 hover:bg-base-800 rounded-md transition-colors">
          🔔
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{usuario?.nome}</p>
            <p className="text-xs text-support-300">{usuario?.email}</p>
          </div>
          <Avatar name={usuario?.nome || 'User'} />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
