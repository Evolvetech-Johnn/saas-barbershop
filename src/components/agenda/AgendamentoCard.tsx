import React from 'react';
import { useAgenda } from '@/hooks/useAgenda';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { statusLabels } from '@/components/agenda/statusLabels';
import { motion } from 'framer-motion';

interface AgendamentoCardProps {
  cliente: string;
  profissional: string;
  servico: string;
  horario: string;
  status: string;
}

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  cliente,
  profissional,
  servico,
  horario,
  status,
}) => {
  const { agendamentos, concluirAgendamento } = useAgenda();
  const handleConcluir = () => {
    // Find the underlying agendamento by matching fields (simplified lookup)
    const ag = agendamentos.find(
      a => (a.clienteNome === cliente || (a.clienteId as any)?.nome === cliente) && 
           (a.profissionalId as any)?.nome === profissional && 
           (a.servicoId as any)?.nome === servico && 
           new Date(a.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) === horario
    );
    if (ag) concluirAgendamento(ag);
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
      
      {status === 'confirmado' && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex justify-end">
          <Button variant="success" size="sm" onClick={handleConcluir}>
            Concluir Atendimento
          </Button>
        </div>
      )}
    </motion.div>
  );
};
