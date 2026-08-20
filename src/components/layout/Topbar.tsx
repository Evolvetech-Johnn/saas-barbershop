import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { Menu, Bell, LogOut } from 'lucide-react';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { usuario, logout } = useAuth();
  const { tenant } = useTenant();

  const handleLogout = async () => {
    // navigate() e até window.location.hash perdem a corrida aqui: o
    // ProtectedRoute da rota protegida atual (ex: /app/dashboard) ainda está
    // montado quando a sessão é limpa, e seu próprio redirect pra /app/login
    // sobrepõe o nosso. Um reload completo elimina a árvore de componentes
    // React inteira, sem disputa possível.
    const destino = tenant?.slug ? `/${tenant.slug}` : '/';
    await logout();
    window.location.hash = `#${destino}`;
    window.location.reload();
  };

  return (
    <header className="h-16 bg-surface-1 border-b border-border-subtle flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-2 lg:hidden text-text-muted hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block" />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border border-surface-1" />
        </button>
        <div className="flex items-center gap-3 border-l border-border-subtle pl-4 ml-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{usuario?.nome}</p>
            <p className="text-xs text-text-muted">{usuario?.email}</p>
          </div>
          <Avatar name={usuario?.nome || 'User'} />
          <button 
            onClick={handleLogout}
            className="p-2 ml-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
