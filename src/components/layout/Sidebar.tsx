import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  PenTool, 
  DollarSign, 
  Banknote, 
  Package, 
  ClipboardList, 
  LineChart, 
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

const menuGroups = [
  {
    label: 'Operação',
    items: [
      { path: '/app/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
      { path: '/app/agenda', label: 'Agenda', icon: Calendar },
      { path: '/app/clientes', label: 'Clientes', icon: Users },
    ]
  },
  {
    label: 'Gestão',
    items: [
      { path: '/app/financeiro', label: 'Financeiro', icon: DollarSign },
      { path: '/app/equipe', label: 'Equipe', icon: Scissors },
      { path: '/app/servicos', label: 'Serviços', icon: PenTool },
      { path: '/app/estoque', label: 'Estoque', icon: Package },
    ]
  },
  {
    label: 'Crescimento',
    items: [
      { path: '/app/planos', label: 'Planos', icon: ClipboardList },
      { path: '/app/comissoes', label: 'Comissões', icon: Banknote },
      { path: '/app/relatorios', label: 'Relatórios', icon: LineChart },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { path: '/app/configuracoes', label: 'Configurações', icon: Settings },
    ]
  }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const { tenant } = useTenant();
  const [collapsed, setCollapsed] = useState(false);

  if (!tenant) return null;

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-hidden bg-surface-1 border-r border-border-subtle">
      {/* Header */}
      <div className={`p-4 flex items-center border-b border-border-subtle transition-all ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 rounded bg-surface-raised flex items-center justify-center overflow-hidden border border-border-strong">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.nome} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif font-bold text-sm text-text-primary">{tenant.nome.charAt(0)}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-medium text-sm text-text-primary truncate max-w-[140px]">{tenant.nome}</span>
            <span className="text-[10px] text-text-muted uppercase tracking-wider">{tenant.planoSaas}</span>
          </div>
        </div>
        {collapsed && (
          <div className="w-8 h-8 rounded bg-surface-raised flex items-center justify-center border border-border-strong">
            <span className="font-serif font-bold text-sm text-text-primary">{tenant.nome.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Search / Command Palette Trigger */}
      {!collapsed && (
        <div className="px-4 py-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 bg-background border border-border-subtle rounded-md text-sm text-text-muted hover:border-border-strong transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border-subtle bg-surface-1 px-1.5 font-mono text-[10px] font-medium text-text-muted group-hover:text-text-secondary">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin py-2">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-4">
            {!collapsed && (
              <div className="px-4 mb-1">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{group.label}</span>
              </div>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose} // Close drawer on mobile
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isActive
                          ? 'bg-accent/10 text-accent font-medium'
                          : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      {!collapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border-subtle hidden lg:flex">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 text-text-muted hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:block transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'}`}>
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-surface-1 z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary bg-background rounded-md border border-border-subtle"
        >
          <X className="w-4 h-4" />
        </button>
      </aside>

      {/* Backdrop for mobile when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
    </>
  );
};
