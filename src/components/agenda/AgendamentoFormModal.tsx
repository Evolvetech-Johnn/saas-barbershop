import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface AgendamentoFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AgendamentoFormModal: React.FC<AgendamentoFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    cliente: '',
    profissional: '',
    servico: '',
    horario: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-support-200 mb-2">Cliente</label>
          <Input
            placeholder="Nome do cliente"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Profissional</label>
          <Select
            value={formData.profissional}
            onChange={(e) => setFormData({ ...formData, profissional: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="carlos">Carlos</option>
            <option value="ana">Ana</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Serviço</label>
          <Select
            value={formData.servico}
            onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
          >
            <option value="">Selecione</option>
            <option value="corte">Corte de Cabelo</option>
            <option value="barba">Barba</option>
            <option value="completo">Corte + Barba</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Horário</label>
          <Input
            type="time"
            value={formData.horario}
            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
          />
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
