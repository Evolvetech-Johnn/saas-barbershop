import React from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

interface ClienteCardProps {
  nome: string
  telefone: string
  email: string
  totalAtendimentos: number
  ultimoAtendimento: string
  aniversario?: string
}

export const ClienteCard: React.FC<ClienteCardProps> = ({
  nome,
  telefone,
  email,
  totalAtendimentos,
  ultimoAtendimento,
  aniversario,
}) => {
  return (
    <div className="bg-base-900 border border-base-800 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-3">
        <Avatar name={nome} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{nome}</h4>
            {aniversario && <Badge variant="default">🎂 Aniversário</Badge>}
          </div>
          <p className="text-sm text-support-300">{telefone}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
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
