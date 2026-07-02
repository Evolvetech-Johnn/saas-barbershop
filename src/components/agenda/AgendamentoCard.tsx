import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

interface AgendamentoCardProps {
  cliente: string
  profissional: string
  servico: string
  horario: string
  status: 'confirmado' | 'concluido' | 'faltou' | 'cancelado'
}

const statusLabels: Record<string, string> = {
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  faltou: 'Faltou',
  cancelado: 'Cancelado'
}

export const AgendamentoCard: React.FC<AgendamentoCardProps> = ({
  cliente,
  profissional,
  servico,
  horario,
  status,
}) => {
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
      </div>
    </div>
  )
}
