import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { mockData } from '@/data/mockData'
import { useTenant } from '@/context/TenantContext'
import { Agendamento } from '@/types/agendamento'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.profissionalId || !formData.servicoId || !formData.data || !formData.horario) {
      return;
    }

    const dataHora = new Date(`${formData.data}T${formData.horario}:00`);

    onSave({
      profissionalId: formData.profissionalId,
      servicoId: formData.servicoId,
      clienteNome: formData.clienteNome,
      clienteTelefone: formData.clienteTelefone,
      dataHora,
      status: 'confirmado'
    })
    
    setFormData({
      clienteNome: '',
      clienteTelefone: '',
      profissionalId: '',
      servicoId: '',
      data: new Date().toISOString().split('T')[0],
      horario: '09:00',
    });
    
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
            onChange={(e) => setFormData({ ...formData, profissionalId: e.target.value })}
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
        <div className="grid grid-cols-2 gap-4">
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
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}
