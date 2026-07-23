import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CalendarioAgenda } from '@/components/agenda/CalendarioAgenda'
import { AgendamentoCard } from '@/components/agenda/AgendamentoCard'
import { AgendamentoFormModal } from '@/components/agenda/AgendamentoFormModal'
import { useAgenda } from '@/hooks/useAgenda'
import { Agendamento } from '@/types/agendamento'

export const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { agendamentos, criarAgendamento } = useAgenda()

  const agendamentosDoDia = agendamentos.filter((a) => {
    const d = new Date(a.dataHora)
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    )
  })

  // Use populated fields from backend
  const getProfissionalNome = (agendamento: Agendamento) => {
    return agendamento.profissionalId?.nome || 'Profissional'
  }
  const getServicoNome = (agendamento: Agendamento) => {
    return agendamento.servicoId?.nome || 'Serviço'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Agenda</h1>
          <p className="text-support-300">
            {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CalendarioAgenda
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Atendimentos do dia</h3>
          {agendamentosDoDia.map((agendamento) => (
            <AgendamentoCard
              key={(agendamento as any)._id || agendamento.id}
              cliente={agendamento.clienteNome}
              profissional={getProfissionalNome(agendamento)}
              servico={getServicoNome(agendamento)}
              horario={new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
              status={agendamento.status}
            />
          ))}
          {agendamentosDoDia.length === 0 && (
             <div className="text-center py-8 bg-base-900 border border-base-800 rounded-lg">
                <p className="text-support-300">Nenhum agendamento para este dia.</p>
             </div>
          )}
        </div>
      </div>

      <AgendamentoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={criarAgendamento}
      />
    </div>
  )
}
