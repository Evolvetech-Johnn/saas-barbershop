import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Agendamento } from '@/types/agendamento';
import { Calendar } from 'lucide-react';

interface ProximosAgendamentosProps {
  agendamentosHoje?: Agendamento[];
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  faltou: 'Faltou',
  cancelado: 'Cancelado'
};

export const ProximosAgendamentos: React.FC<ProximosAgendamentosProps> = ({ agendamentosHoje = [] }) => {
  // Ordenar agendamentos pelo horário mais cedo primeiro
  const agendamentosOrdenados = [...agendamentosHoje].sort((a, b) => {
    return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
  });

  return (
    <div className="bg-surface-1 border border-border-subtle rounded-xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-text-muted" />
        <h3 className="text-lg font-serif font-semibold text-text-primary">Próximos Hoje</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {agendamentosOrdenados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
            <Calendar className="w-10 h-10 mb-3 text-text-muted" />
            <p className="text-text-secondary text-sm">Nenhum agendamento para hoje.</p>
          </div>
        ) : (
          agendamentosOrdenados.map(agendamento => {
            const servicoNome = (agendamento.servicoId as any)?.nome || 'Serviço';
            const profissionalNome = (agendamento.profissionalId as any)?.nome || 'Profissional';
            const nomeCliente = (agendamento.clienteId as any)?.nome || agendamento.clienteNome || 'Cliente não identificado';
            
            const horas = new Date(agendamento.dataHora).getHours().toString().padStart(2, '0');
            const minutos = new Date(agendamento.dataHora).getMinutes().toString().padStart(2, '0');
            const horarioFormatado = `${horas}:${minutos}`;

            return (
              <div key={(agendamento as any)._id || agendamento.id} className="flex items-center gap-4 p-3 bg-surface-2 rounded-lg border border-border-subtle hover:border-border-strong transition-colors">
                <div className="text-center w-14 flex-shrink-0 border-r border-border-subtle pr-3">
                  <p className="font-bold text-lg text-text-primary leading-none mb-1">{horarioFormatado}</p>
                  <p className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">Hora</p>
                </div>
                
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <Avatar name={nomeCliente} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-text-primary truncate">{nomeCliente}</p>
                    <p className="text-xs text-text-muted truncate">
                      {servicoNome} • {profissionalNome}
                    </p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <Badge
                    variant={
                      agendamento.status === 'confirmado'
                        ? 'success'
                        : agendamento.status === 'cancelado' || agendamento.status === 'faltou'
                        ? 'danger'
                        : 'default'
                    }
                  >
                    {statusLabels[agendamento.status] || agendamento.status}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
