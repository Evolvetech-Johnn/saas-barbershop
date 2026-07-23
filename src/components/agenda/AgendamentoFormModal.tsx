import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useTenant } from '@/context/TenantContext'
import { Agendamento } from '@/types/agendamento'
import { useProfissionais } from '@/hooks/useProfissionais'
import { useServicos } from '@/hooks/useServicos'

interface AgendamentoFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Agendamento>) => Promise<boolean>
}

export const AgendamentoFormModal: React.FC<AgendamentoFormModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { tenant } = useTenant()
  const { profissionais } = useProfissionais()
  const { servicos } = useServicos()
  
  const [formData, setFormData] = useState({
    clienteNome: '',
    clienteTelefone: '',
    profissionalId: '',
    servicoId: '',
    data: new Date().toISOString().split('T')[0],
    horario: '09:00',
  })
  
  const [loading, setLoading] = useState(false)

  const servicoSelecionado = servicos.find((s) => ((s as any)._id || s.id) === formData.servicoId)
  const duracaoMinutos = servicoSelecionado?.duracaoMinutos ?? 30

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tenant) return

    if (!formData.profissionalId || !formData.servicoId || !formData.data || !formData.horario) {
      return
    }

    const dataHora = new Date(`${formData.data}T${formData.horario}:00`)

    setLoading(true)
    const success = await onSave({
      profissionalId: formData.profissionalId,
      servicoId: formData.servicoId,
      clienteNome: formData.clienteNome,
      clienteTelefone: formData.clienteTelefone,
      dataHora,
      duracaoMinutos,
      status: 'confirmado'
    })
    setLoading(false)

    if (success) {
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
            {profissionais.map((p) => {
              const id = (p as any)._id || p.id;
              return <option key={id} value={id}>{p.nome}</option>
            })}
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
            {servicos.map((s) => {
              const id = (s as any)._id || s.id;
              return <option key={id} value={id}>{s.nome}</option>
            })}
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
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
