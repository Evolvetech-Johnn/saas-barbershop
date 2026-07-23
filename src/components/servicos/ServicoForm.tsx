import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Clock, Percent } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Servico } from '@/types/servico';

interface ServicoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Servico>) => Promise<boolean>;
  servico: Servico | null;
}

export const ServicoForm: React.FC<ServicoFormProps> = ({ isOpen, onClose, onSave, servico }) => {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState<number | ''>('');
  const [duracaoMinutos, setDuracaoMinutos] = useState<number | ''>(30);
  const [comissaoPercentual, setComissaoPercentual] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (servico) {
      setNome(servico.nome);
      setPreco(servico.preco);
      setDuracaoMinutos(servico.duracaoMinutos);
      setComissaoPercentual(servico.comissaoPercentual ?? '');
    } else {
      setNome('');
      setPreco('');
      setDuracaoMinutos(30);
      setComissaoPercentual('');
    }
  }, [servico, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preco === '' || duracaoMinutos === '') return;

    setLoading(true);
    const success = await onSave({
      nome,
      preco: Number(preco),
      duracaoMinutos: Number(duracaoMinutos),
      comissaoPercentual: comissaoPercentual !== '' ? Number(comissaoPercentual) : undefined
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
                {servico ? 'Editar Serviço' : 'Novo Serviço'}
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
              <form id="servico-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-support-200 mb-2">Nome do Serviço</label>
                  <Input
                    autoFocus
                    placeholder="Ex: Corte Degradê"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-support-200 mb-2 flex items-center gap-1">
                      <DollarSign size={14} />
                      Preço (R$)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="35.00"
                      value={preco}
                      onChange={e => setPreco(e.target.value ? Number(e.target.value) : '')}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-support-200 mb-2 flex items-center gap-1">
                      <Clock size={14} />
                      Duração (min)
                    </label>
                    <Input
                      type="number"
                      step="5"
                      min="5"
                      placeholder="30"
                      value={duracaoMinutos}
                      onChange={e => setDuracaoMinutos(e.target.value ? Number(e.target.value) : '')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-support-200 mb-2 flex items-center gap-1">
                    <Percent size={14} />
                    Comissão do Profissional (%)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="50"
                    value={comissaoPercentual}
                    onChange={e => setComissaoPercentual(e.target.value ? Number(e.target.value) : '')}
                  />
                  <p className="text-xs text-support-400 mt-2">
                    Deixe em branco se a comissão for definida globalmente no perfil do barbeiro.
                  </p>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-base-800 bg-base-900/50 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" form="servico-form" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Serviço'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
