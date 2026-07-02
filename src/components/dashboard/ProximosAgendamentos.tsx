import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

interface Agendamento {
  id: string
  cliente: string
  profissional: string
  servico: string
  horario: string
  status: 'confirmado' | 'concluido' | 'faltou' | 'cancelado'
}

const mockAgendamentos: Agendamento[] = [
  {
    id: '1',
    cliente: 'João Silva',
    profissional: 'Carlos',
    servico: 'Corte de Cabelo',
    horario: '10:00',
    status: 'confirmado'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    profissional: 'Ana',
    servico: 'Barba',
    horario: '10:30',
    status: 'confirmado'
  },
  {
    id: '3',
    cliente: 'Pedro Costa',
    profissional: 'Carlos',
    servico: 'Corte + Barba',
    horario: '11:00',
    status: 'confirmado'
  }
]

const statusLabels: Record<string, string> = {
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  faltou: 'Faltou',
  cancelado: 'Cancelado'
}

export const ProximosAgendamentos: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Próximos Agendamentos</h3>
      <div className="space-y-4">
        {mockAgendamentos.map(agendamento => (
          <div key={agendamento.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={agendamento.cliente} size="md" />
              <div>
                <p className="font-medium">{agendamento.cliente}</p>
                <p className="text-sm text-support-300">
                  {agendamento.servico} • {agendamento.profissional}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{agendamento.horario}</p>
              <Badge
                variant={
                  agendamento.status === 'confirmado'
                    ? 'success'
                    : agendamento.status === 'cancelado'
                    ? 'danger'
                    : 'default'
                }
              >
                {statusLabels[agendamento.status]}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
