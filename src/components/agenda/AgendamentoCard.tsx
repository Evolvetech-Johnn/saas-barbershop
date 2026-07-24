import React, { useState } from 'react';
import { useAgenda } from '@/hooks/useAgenda';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { statusLabels } from '@/components/agenda/statusLabels';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AgendamentoCardProps {
  id: string;
  cliente: string;
  profissional: string;
  servico: string;
  horario: string;
  status: string;
}

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  id,
  cliente,
  profissional,
  servico,
  horario,
  status,
}) => {
  const { agendamentos, concluirAgendamento, atualizarAgendamento } = useAgenda();
  const [isCanceling, setIsCanceling] = useState(false);
  const [motivo, setMotivo] = useState('');

  const handleConcluir = () => {
    const ag = agendamentos.find(a => ((a as any)._id || a.id) === id);
    if (ag) concluirAgendamento(ag);
  };

  const handleConfirmarCancelamento = async () => {
    if (!motivo.trim()) return;
    await atualizarAgendamento(id, { status: 'cancelado', observacoes: motivo });
    setIsCanceling(false);
    setMotivo('');
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-surface-1 border border-border-subtle rounded-lg p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/20" />
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pl-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={cliente} size="md" />
          <div className="truncate">
            <p className="font-medium text-text-primary truncate">{cliente}</p>
            <p className="text-xs text-text-muted truncate">{servico}</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end shrink-0 gap-1.5">
          <Badge
            variant={
              status === 'confirmado'
                ? 'success'
                : status === 'cancelado'
                ? 'danger'
                : status === 'concluido'
                ? 'default'
                : 'warning'
            }
          >
            {statusLabels[status] || status}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg font-serif text-text-primary">{horario}</span>
          </div>
        </div>
      </div>
      
      {status === 'confirmado' && !isCanceling && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex justify-end gap-2">
          <Button variant="danger" size="sm" onClick={() => setIsCanceling(true)} className="bg-transparent text-status-error hover:bg-status-error/10 border border-status-error/20">
            <X className="w-4 h-4 mr-1" /> Cancelar
          </Button>
          <Button variant="success" size="sm" onClick={handleConcluir}>
            Concluir Atendimento
          </Button>
        </div>
      )}

      <AnimatePresence>
        {isCanceling && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-3 border-t border-border-subtle space-y-3 overflow-hidden"
          >
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Motivo do cancelamento</label>
              <Input 
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Cliente desmarcou, imprevisto..."
                autoFocus
                className="text-sm h-9"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsCanceling(false)}>
                Voltar
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmarCancelamento} disabled={!motivo.trim()}>
                Confirmar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
