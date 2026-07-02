import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CalendarioAgenda } from '@/components/agenda/CalendarioAgenda'
import { AgendamentoCard } from '@/components/agenda/AgendamentoCard'
import { AgendamentoFormModal } from '@/components/agenda/AgendamentoFormModal'

const mockAgendamentos = [
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
  },
  {
    id: '4',
    cliente: 'Lucas Ferreira',
    profissional: 'Ana',
    servico: 'Corte de Cabelo',
    horario: '11:30',
    status: 'confirmado'
  }
]

export const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          {mockAgendamentos.map((agendamento) => (
            <AgendamentoCard
              key={agendamento.id}
              cliente={agendamento.cliente}
              profissional={agendamento.profissional}
              servico={agendamento.servico}
              horario={agendamento.horario}
              status={agendamento.status}
            />
          ))}
        </div>
      </div>

      <AgendamentoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
