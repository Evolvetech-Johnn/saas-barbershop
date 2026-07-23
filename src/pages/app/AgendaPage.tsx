import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CalendarioAgenda } from '@/components/agenda/CalendarioAgenda';
import { AgendamentoCard } from '@/components/agenda/AgendamentoCard';
import { AgendamentoFormModal } from '@/components/agenda/AgendamentoFormModal';
import { useAgenda } from '@/hooks/useAgenda';
import { Agendamento } from '@/types/agendamento';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Calendar, Plus, Clock } from 'lucide-react';

export const AgendaPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { agendamentos, criarAgendamento } = useAgenda();

  const agendamentosDoDia = agendamentos.filter((a) => {
    const d = new Date(a.dataHora);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Group by professional for column view
  const profissionaisMap = new Map<string, { nome: string, agendamentos: Agendamento[] }>();
  
  agendamentosDoDia.forEach(agendamento => {
    const profId = (agendamento.profissionalId as any)?._id || 'unassigned';
    const profNome = (agendamento.profissionalId as any)?.nome || 'Sem profissional';
    
    if (!profissionaisMap.has(profId)) {
      profissionaisMap.set(profId, { nome: profNome, agendamentos: [] });
    }
    profissionaisMap.get(profId)!.agendamentos.push(agendamento);
  });

  const profissionaisCols = Array.from(profissionaisMap.values());

  const getServicoNome = (agendamento: Agendamento) => {
    return (agendamento.servicoId as any)?.nome || 'Serviço';
  };

  const getHorarioFormatado = (agendamento: Agendamento) => {
    return new Date(agendamento.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <PageHeader 
        title="Agenda" 
        description={selectedDate.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        action={
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Agendamento
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar Calendar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-surface-1 border border-border-subtle rounded-xl p-4 shadow-sm h-full">
            <CalendarioAgenda
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            {/* Quick Stats or mini-list could go here */}
          </div>
        </div>

        {/* Schedule View */}
        <div className="flex-1 bg-surface-1 border border-border-subtle rounded-xl shadow-sm flex flex-col min-w-0 overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-muted" /> Atendimentos do dia
            </h3>
          </div>
          
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            {profissionaisCols.length === 0 ? (
              <div className="h-full flex items-center justify-center p-6">
                <EmptyState 
                  icon={Calendar}
                  title="Nenhum agendamento"
                  description={`Não há atendimentos marcados para ${selectedDate.toLocaleDateString('pt-BR')}.`}
                  actionLabel="Novo Agendamento"
                  onAction={() => setIsModalOpen(true)}
                />
              </div>
            ) : (
              <div className="flex h-full min-w-max p-4 gap-4">
                {profissionaisCols.map((col, idx) => (
                  <div key={idx} className="w-80 flex flex-col h-full">
                    <div className="bg-surface-2 border border-border-subtle rounded-t-lg p-3 text-center mb-3 shrink-0">
                      <span className="font-medium text-text-primary">{col.nome}</span>
                      <span className="ml-2 text-xs text-text-muted bg-background px-2 py-0.5 rounded-full">
                        {col.agendamentos.length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                      {col.agendamentos
                        .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
                        .map((agendamento) => (
                          <AgendamentoCard
                            key={(agendamento as any)._id || agendamento.id}
                            cliente={agendamento.clienteNome || 'Cliente não identificado'}
                            profissional={col.nome}
                            servico={getServicoNome(agendamento)}
                            horario={getHorarioFormatado(agendamento)}
                            status={agendamento.status}
                          />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AgendamentoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={criarAgendamento}
      />
    </div>
  );
};
