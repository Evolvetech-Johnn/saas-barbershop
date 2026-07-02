import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/admin/tenants', label: 'Tenants', icon: '🏢' },
  { path: '/admin/planos', label: 'Planos', icon: '📋' },
  { path: '/admin/faturamento', label: 'Faturamento', icon: '💰' },
];

export const SuperAdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-base-950">
      <aside className="w-64 bg-base-900 border-r border-base-800 min-h-screen flex flex-col">
        <div className="p-4 border-b border-base-800">
          <h2 className="font-serif text-xl font-bold">SaaS Admin</h2>
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
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-base-900 border-b border-base-800 flex items-center justify-between px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="p-2 text-support-300 hover:text-support-100 hover:bg-base-800 rounded-md transition-colors">
              🔔
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-support-300">admin@saas.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--tenant-accent)] text-base-950 flex items-center justify-center font-semibold">
                SA
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
