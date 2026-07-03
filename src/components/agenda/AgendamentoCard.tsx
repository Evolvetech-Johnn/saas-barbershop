import { useAgenda } from '@/hooks/useAgenda';

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  cliente,
  profissional,
  servico,
  horario,
  status,
}) => {
  const { concluirAgendamento } = useAgenda();
  const handleConcluir = () => {
    // Find the underlying agendamento by matching fields (simplified lookup)
    const ag = mockData.agendamentos.find(
      a => a.clienteNome === cliente && a.profissionalId === professionalId && a.servicoId === serviceId && a.dataHora === horario,
    );
    if (ag) concluirAgendamento(ag.id);
  };

  return (
    <div className="bg-base-900 border border-base-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar name={cliente} size="md" />
          <div>
            <p className="font-medium">{cliente}</p>
            <p className="text-sm text-support-300">{profissional}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">{horario}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-support-200">{servico}</p>
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
  );
};
