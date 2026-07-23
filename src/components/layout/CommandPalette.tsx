import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Calendar, Users, DollarSign, Package, Settings, X } from 'lucide-react';

const commands = [
  { id: 'dash', label: 'Ir para Visão Geral', icon: LayoutDashboard, path: '/app/dashboard' },
  { id: 'agenda', label: 'Ir para Agenda', icon: Calendar, path: '/app/agenda' },
  { id: 'clientes', label: 'Ir para Clientes', icon: Users, path: '/app/clientes' },
  { id: 'fin', label: 'Ir para Financeiro', icon: DollarSign, path: '/app/financeiro' },
  { id: 'estoque', label: 'Ir para Estoque', icon: Package, path: '/app/estoque' },
  { id: 'config', label: 'Ir para Configurações', icon: Settings, path: '/app/configuracoes' },
];

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        setSearch('');
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const handleNavigation = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
      }
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        navigate(filteredCommands[selectedIndex].path);
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleNavigation);
    return () => document.removeEventListener('keydown', handleNavigation);
  }, [open, filteredCommands, selectedIndex, navigate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-surface-1 rounded-xl shadow-2xl border border-border-strong overflow-hidden z-[101]"
          >
            <div className="flex items-center px-4 py-3 border-b border-border-subtle">
              <Search className="w-5 h-5 text-text-muted mr-3" />
              <input
                autoFocus
                className="flex-1 bg-transparent border-none text-text-primary text-base placeholder-text-muted focus:outline-none"
                placeholder="Buscar ou digitar um comando..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-10 text-center text-text-muted text-sm">
                  Nenhum comando encontrado.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        navigate(cmd.path);
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors outline-none ${
                        isSelected ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{cmd.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
