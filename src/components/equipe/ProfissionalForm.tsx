import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Profissional } from '@/types/profissional';

interface ProfissionalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Profissional>) => Promise<boolean>;
  profissional: Profissional | null;
}

export const ProfissionalForm: React.FC<ProfissionalFormProps> = ({ isOpen, onClose, onSave, profissional }) => {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#10b981');
  const [especialidades, setEspecialidades] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profissional) {
      setNome(profissional.nome);
      setCor(profissional.cor || '#10b981');
      setEspecialidades((profissional.especialidade || []).join(', '));
    } else {
      setNome('');
      setCor('#10b981');
      setEspecialidades('');
    }
  }, [profissional, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSave({
      nome,
      cor,
      especialidade: especialidades.split(',').map(e => e.trim()).filter(Boolean)
    });
    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base-950/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-base-900 border-l border-base-800 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-base-800">
              <h2 className="text-xl font-serif font-bold text-base-100">
                {profissional ? 'Editar Profissional' : 'Novo Profissional'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-support-300 hover:text-base-100 hover:bg-base-800 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form id="profissional-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-support-200 mb-2">Nome</label>
                  <Input
                    autoFocus
                    placeholder="Ex: João Barbeiro"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-support-200 mb-2">Especialidades (separadas por vírgula)</label>
                  <Input
                    placeholder="Corte, Barba, Pigmentação..."
                    value={especialidades}
                    onChange={e => setEspecialidades(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-support-200 mb-2">Cor na Agenda</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={cor}
                      onChange={e => setCor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm font-mono text-support-300">{cor.toUpperCase()}</span>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-base-800 bg-base-900/50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" form="profissional-form" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Profissional'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
