import React from 'react';
import { useAgenda } from '@/hooks/useAgenda';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { statusLabels } from '@/components/agenda/statusLabels';

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
      a => a.clienteNome === cliente && a.profissionalId === profissional && a.servicoId === servico && a.dataHora.toString() === horario,
    );
    if (ag) concluirAgendamento(ag.id);
  };

  return (
    <div className="bg-base-900 border border-base-800 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar name={cliente} size="md" />
          <div className="truncate">
            <p className="font-medium truncate">{cliente}</p>
            <p className="text-sm text-support-300 truncate">{profissional}</p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 text-right">
          <p className="font-semibold">{horario}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
        <p className="text-sm text-support-200 truncate">{servico}</p>
        <div className="flex items-center gap-2">
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
            {statusLabels[status]}
          </Badge>
          {status === 'confirmado' && (
            <Button variant="success" size="sm" onClick={handleConcluir}>
              Concluir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
