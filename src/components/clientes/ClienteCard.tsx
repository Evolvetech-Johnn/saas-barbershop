import React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ClienteCardProps {
  nome: string
  telefone: string
  email?: string
  totalAtendimentos: number
  ultimoAtendimento: string
  aniversario?: string
  onEdit?: () => void
  onDelete?: () => void
}

export const ClienteCard: React.FC<ClienteCardProps> = ({
  nome,
  telefone,
  email,
  totalAtendimentos,
  ultimoAtendimento,
  aniversario,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-base-900 border border-base-800 rounded-lg p-4 relative group">
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button onClick={onEdit} className="text-support-300 hover:text-support-100" aria-label="Editar">
            ✏️
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-support-300 hover:text-red-400" aria-label="Excluir">
            🗑️
          </button>
        )}
      </div>
      <div className="flex items-center gap-4 mb-3">
        <Avatar name={nome} size="lg" />
        <div className="flex-1 pr-12">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{nome}</h4>
            {aniversario && <Badge variant="default">🎂 Aniversário</Badge>}
          </div>
          <p className="text-sm text-support-300">{telefone}</p>
          {email && <p className="text-sm text-support-300">{email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-base-800 pt-4">
        <div>
          <p className="text-support-300">Atendimentos</p>
          <p className="font-semibold">{totalAtendimentos}</p>
        </div>
        <div>
          <p className="text-support-300">Último atendimento</p>
          <p className="font-semibold">{ultimoAtendimento}</p>
        </div>
      </div>
    </div>
  )
}
