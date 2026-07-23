import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CalendarioAgenda } from '@/components/agenda/CalendarioAgenda'
import { useTenant } from '@/context/TenantContext'
import { agendamentoService } from '@/services/agendamentoService'
import { useToast } from '@/context/ToastContext'
import { useServicos } from '@/hooks/useServicos'
import { useProfissionais } from '@/hooks/useProfissionais'

const mockHorarios = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
]

export const AgendamentoPublicoForm: React.FC = () => {
  const { tenant } = useTenant()
  const { addToast } = useToast()
  
  const { servicos } = useServicos()
  const { profissionais } = useProfissionais()

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    servico: '',
    profissional: '',
    horario: '',
  })

  const servicoSelecionado = servicos.find((servico) => ((servico as any)._id || servico.id) === formData.servico)
  const duracaoMinutos = servicoSelecionado?.duracaoMinutos ?? 30

  const horariosDisponiveis = mockHorarios; // Simpler approach: let backend validate conflict

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenant) return

    if (!formData.servico || !formData.profissional || !formData.horario) {
      addToast('Selecione serviço, profissional e horário para confirmar o agendamento.', 'error')
      return
    }

    const [horas, minutos] = formData.horario.split(':').map(Number)
    const dataHora = new Date(selectedDate)
    dataHora.setHours(horas, minutos, 0, 0)

    try {
      await agendamentoService.create(tenant.id, {
        clienteNome: formData.nome,
        clienteTelefone: formData.telefone,
        clienteEmail: formData.email,
        servicoId: formData.servico,
        profissionalId: formData.profissional,
        dataHora,
        duracaoMinutos,
        status: 'confirmado'
      })

      setStep(4)
      addToast('Agendamento confirmado com sucesso!', 'success')
    } catch (error: any) {
      addToast(error.message || 'Horário não disponível. Escolha outro.', 'error')
    }
  }

  const handleNextStep = () => {
    if (step === 1 && !formData.servico) return
    if (step === 2 && !formData.profissional) return
    if (step === 3 && !formData.horario) return
    setStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-2">
              Escolha o serviço
            </h3>
            <p className="text-support-300">
              Selecione o serviço que você deseja agendar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicos.map((servico) => (
              <button
                key={servico.id}
                onClick={() => setFormData({ ...formData, servico: servico.id })}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  formData.servico === servico.id
                    ? 'border-[var(--tenant-accent)] bg-[var(--tenant-accent)]/10'
                    : 'border-base-800 bg-base-900 hover:bg-base-800'
                }`}
              >
                <h4 className="font-semibold">{servico.nome}</h4>
                <p className="text-sm text-support-300">
                  {servico.duracaoMinutos} min • R$ {servico.preco.toFixed(2)}
                </p>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleNextStep} disabled={!formData.servico}>
              Próximo
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-2">
              Escolha o profissional
            </h3>
            <p className="text-support-300">
              Selecione com quem você quer atendimento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profissionais.map((profissional) => (
              <button
                key={profissional.id}
                onClick={() =>
                  setFormData({ ...formData, profissional: profissional.id, horario: '' })
                }
                className={`p-4 rounded-lg border transition-colors text-left ${
                  formData.profissional === profissional.id
                    ? 'border-[var(--tenant-accent)] bg-[var(--tenant-accent)]/10'
                    : 'border-base-800 bg-base-900 hover:bg-base-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-base-800 flex items-center justify-center text-2xl">
                    🧔🏻
                  </div>
                  <h4 className="font-semibold truncate">{profissional.nome}</h4>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button variant="ghost" onClick={handlePrevStep}>
              Voltar
            </Button>
            <Button onClick={handleNextStep} disabled={!formData.profissional}>
              Próximo
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-2">
              Escolha a data e hora
            </h3>
            <p className="text-support-300">
              Selecione quando você quer vir
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CalendarioAgenda
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Horários disponíveis</h4>
                {formData.profissional ? (
                  horariosDisponiveis.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {horariosDisponiveis.map((horario) => (
                        <button
                          key={horario}
                          onClick={() => setFormData({ ...formData, horario })}
                          className={`p-3 rounded-lg border transition-colors text-center ${
                            formData.horario === horario
                              ? 'border-[var(--tenant-accent)] bg-[var(--tenant-accent)] text-base-950 font-medium'
                              : 'border-base-800 bg-base-900 hover:bg-base-800'
                          }`}
                        >
                          {horario}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-base-800 bg-base-900 p-4 text-sm text-support-300">
                      Não há horários livres para este profissional neste dia.
                    </p>
                  )
                ) : (
                  <p className="rounded-lg border border-base-800 bg-base-900 p-4 text-sm text-support-300">
                    Escolha um profissional para ver os horários.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Seu nome
              </label>
              <Input
                placeholder="Nome completo"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Seu telefone
              </label>
              <Input
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) =>
                  setFormData({ ...formData, telefone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-support-200 mb-2">
                Seu email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button variant="ghost" onClick={handlePrevStep}>
              Voltar
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.horario || !formData.nome}>
              Confirmar
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-6 py-12">
          <div className="text-5xl">✅</div>
          <div>
            <h3 className="text-2xl font-serif font-semibold mb-2">
              Agendamento confirmado!
            </h3>
            <p className="text-support-300">
              Você receberá um email com os detalhes do agendamento em breve.
            </p>
          </div>
          <Button onClick={() => {
            setStep(1)
            setFormData({
              nome: '',
              telefone: '',
              email: '',
              servico: '',
              profissional: '',
              horario: '',
            })
          }}>
            Agendar outro horário
          </Button>
        </div>
      )}
    </div>
  )
}
