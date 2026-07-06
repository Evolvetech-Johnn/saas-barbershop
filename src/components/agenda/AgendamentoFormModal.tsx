import React, { useMemo, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { mockData } from '@/data/mockData'
import { useTenant } from '@/context/TenantContext'
import { Agendamento } from '@/types/agendamento'
import { obterProfissionaisDisponiveis, verificarDisponibilidade } from '@/services/agendamentoService'

interface AgendamentoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Agendamento, 'id' | 'tenantId'>) => void
}

export const AgendamentoFormModal: React.FC<AgendamentoFormModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { tenant } = useTenant()
  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteTelefone: '',
    profissionalId: '',
    servicoId: '',
    data: new Date().toISOString().split('T')[0],
    horario: '09:00',
  })

  const profissionais = tenant ? mockData.profissionais.filter((p) => p.tenantId === tenant.id) : []
  const servicos = tenant ? mockData.servicos.filter((s) => s.tenantId === tenant.id) : []
  const servicoSelecionado = servicos.find((servico) => servico.id === formData.servicoId)
  const duracaoMinutos = servicoSelecionado?.duracaoMinutos ?? 30

  const disponibilidadeAtual = useMemo(() => {
    if (!tenant || !formData.profissionalId || !formData.data || !formData.horario) return null

    return verificarDisponibilidade(tenant.id, formData.profissionalId, formData.data, formData.horario, duracaoMinutos)
  }, [duracaoMinutos, formData.data, formData.horario, formData.profissionalId, tenant])

  const profissionaisAlternativos = useMemo(() => {
    if (!tenant || !formData.profissionalId || !formData.data || !formData.horario) return []

    return obterProfissionaisDisponiveis(
      tenant.id,
      formData.data,
      formData.horario,
      duracaoMinutos,
      profissionais.map((profissional) => profissional.id)
    ).filter((profissional) => profissional.id !== formData.profissionalId)
  }, [duracaoMinutos, formData.data, formData.horario, formData.profissionalId, profissionais, tenant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenant) return

    if (!formData.profissionalId || !formData.servicoId || !formData.data || !formData.horario) {
      return
    }

    const disponibilidade = verificarDisponibilidade(tenant.id, formData.profissionalId, formData.data, formData.horario, duracaoMinutos)
    if (!disponibilidade.disponivel) {
      return
    }

    const dataHora = new Date(`${formData.data}T${formData.horario}:00`)

    onSave({
      profissionalId: formData.profissionalId,
      servicoId: formData.servicoId,
      clienteNome: formData.clienteNome,
      clienteTelefone: formData.clienteTelefone,
      dataHora,
      duracaoMinutos,
      status: 'confirmado'
    })

    setFormData({
      clienteNome: '',
      clienteTelefone: '',
      profissionalId: '',
      servicoId: '',
      data: new Date().toISOString().split('T')[0],
      horario: '09:00',
    })

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-support-200 mb-2">Nome do Cliente</label>
          <Input
            required
            placeholder="Nome completo"
            value={formData.clienteNome}
            onChange={(e) => setFormData({ ...formData, clienteNome: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Telefone do Cliente</label>
          <Input
            required
            placeholder="(00) 00000-0000"
            value={formData.clienteTelefone}
            onChange={(e) => setFormData({ ...formData, clienteTelefone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Profissional</label>
          <Select
            required
            value={formData.profissionalId}
            onChange={(e) => setFormData({ ...formData, profissionalId: e.target.value, horario: '' })}
          >
            <option value="">Selecione</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Serviço</label>
          <Select
            required
            value={formData.servicoId}
            onChange={(e) => setFormData({ ...formData, servicoId: e.target.value })}
          >
            <option value="">Selecione</option>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-support-200 mb-2">Data</label>
            <Input
              required
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Horário</label>
            <Input
              required
              type="time"
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
            />
          </div>
        </div>
        {disponibilidadeAtual && !disponibilidadeAtual.disponivel && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
            {disponibilidadeAtual.mensagem}
          </div>
        )}
        {profissionaisAlternativos.length > 0 && (
          <div className="rounded-lg border border-base-800 bg-base-900 p-3 text-sm">
            <p className="font-medium text-support-100">Profissionais alternativos:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profissionaisAlternativos.map((profissional) => (
                <button
                  key={profissional.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, profissionalId: profissional.id, horario: '' })}
                  className="rounded-lg border border-base-800 bg-base-950 px-3 py-2 text-left hover:bg-base-800"
                >
                  {profissional.nome}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}
