import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';

const menuItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/app/agenda', label: 'Agenda', icon: '📅' },
  { path: '/app/clientes', label: 'Clientes', icon: '👥' },
  { path: '/app/equipe', label: 'Equipe', icon: '✂️' },
  { path: '/app/servicos', label: 'Serviços', icon: '💈' },
  { path: '/app/financeiro', label: 'Financeiro', icon: '💰' },
  { path: '/app/comissoes', label: 'Comissões', icon: '💵' },
  { path: '/app/estoque', label: 'Estoque', icon: '📦' },
  { path: '/app/planos', label: 'Planos', icon: '📋' },
  { path: '/app/relatorios', label: 'Relatórios', icon: '📈' },
  { path: '/app/configuracoes', label: 'Configurações', icon: '⚙️' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const { tenant, availableTenants, switchTenant } = useTenant();

  if (!tenant) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-base-900 border-r border-base-800 min-h-screen flex-col">
        <div className="p-4 border-b border-base-800">
          <div className="flex items-center gap-3 mb-4">
            <img src={tenant.logoUrl} alt={tenant.nome} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 className="font-serif font-semibold">{tenant.nome}</h3>
              <span className="text-xs text-support-300">{tenant.planoSaas}</span>
            </div>
          </div>
          <select
            value={tenant.slug}
            onChange={(e) => switchTenant(e.target.value)}
            className="w-full px-3 py-2 bg-base-800 border border-base-700 rounded text-sm"
          >
            {availableTenants.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[var(--tenant-accent)] text-base-950 font-medium'
                        : 'text-support-200 hover:bg-base-800 hover:text-support-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-base-900 border-r border-base-800 flex flex-col z-40 transform transition-transform lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b border-base-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={tenant.logoUrl} alt={tenant.nome} className="w-8 h-8 rounded-full object-cover" />
            <div>
              <h3 className="font-serif text-sm font-semibold">{tenant.nome}</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-base-800">
            ✕
          </button>
        </div>
        <div className="p-4">
          <select
            value={tenant.slug}
            onChange={(e) => switchTenant(e.target.value)}
            className="w-full px-3 py-2 bg-base-800 border border-base-700 rounded text-sm"
          >
            {availableTenants.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <nav className="flex-1 p-4 overflow-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-[var(--tenant-accent)] text-base-950 font-medium'
                        : 'text-support-200 hover:bg-base-800 hover:text-support-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Backdrop for mobile when open */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
    </>
  );
};
