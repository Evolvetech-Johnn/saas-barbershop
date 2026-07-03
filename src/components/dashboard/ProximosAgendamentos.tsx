import React from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Agendamento } from '@/types/agendamento'
import { mockData } from '@/data/mockData'

interface ProximosAgendamentosProps {
  agendamentosHoje?: Agendamento[]
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  concluido: 'Concluído',
  faltou: 'Faltou',
  cancelado: 'Cancelado'
}

export const ProximosAgendamentos: React.FC<ProximosAgendamentosProps> = ({ agendamentosHoje = [] }) => {
  // Ordenar agendamentos pelo horário mais cedo primeiro
  const agendamentosOrdenados = [...agendamentosHoje].sort((a, b) => {
    return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Próximos Agendamentos</h3>
      <div className="space-y-4">
        {agendamentosOrdenados.length === 0 ? (
          <p className="text-support-300 text-sm">Nenhum agendamento para hoje.</p>
        ) : (
          agendamentosOrdenados.map(agendamento => {
            const servico = mockData.servicos.find(s => s.id === agendamento.servicoId)
            const profissional = mockData.profissionais.find(p => p.id === agendamento.profissionalId)
            const nomeCliente = agendamento.clienteNome || 'Cliente não identificado'
            
            const horas = new Date(agendamento.dataHora).getHours().toString().padStart(2, '0')
            const minutos = new Date(agendamento.dataHora).getMinutes().toString().padStart(2, '0')
            const horarioFormatado = `${horas}:${minutos}`

            return (
              <div key={agendamento.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={nomeCliente} size="md" />
                  <div>
                    <p className="font-medium">{nomeCliente}</p>
                    <p className="text-sm text-support-300">
                      {servico?.nome || 'Serviço'} • {profissional?.nome || 'Profissional'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{horarioFormatado}</p>
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
            )
          })
        )}
      </div>
    </Card>
  )
}
