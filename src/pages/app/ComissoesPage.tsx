import React from 'react'
import { useComissoes } from '@/hooks/useComissoes'
import { ComissoesResumo } from '@/components/comissoes/ComissoesResumo'
import { ComissoesTable } from '@/components/comissoes/ComissoesTable'

export const ComissoesPage: React.FC = () => {
  const { resumo } = useComissoes()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Comissões</h1>
        <p className="text-support-300">Controle de comissões dos profissionais</p>
      </div>

      <ComissoesResumo resumo={resumo} />

      <ComissoesTable resumo={resumo} />
    </div>
  )
}
