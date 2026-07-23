import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useFinanceiro } from '@/hooks/useFinanceiro'

import { FluxoCaixaTable } from '@/components/financeiro/FluxoCaixaTable'
import { ComandaModal } from '@/components/financeiro/ComandaModal'
import { Comanda } from '@/types/comanda'
import { formatters } from '@/utils/formatters'

const getFormaPagamentoLabel = (forma: string): string => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_credito: 'Crédito',
    cartao_debito: 'Débito',
  }
  return labels[forma] || forma
}

export const FinanceiroPage: React.FC = () => {
  const { totais, comandas } = useFinanceiro()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comandaSelecionada, setComandaSelecionada] = useState<Comanda | undefined>()

  const handleNovaComanda = () => {
    setComandaSelecionada(undefined)
    setIsModalOpen(true)
  }

  const handleVerComanda = (comanda: Comanda) => {
    setComandaSelecionada(comanda)
    setIsModalOpen(true)
  }

  const handleSaveComanda = (_data: Partial<Comanda>) => {
    // Not used in this view – creation is handled via agenda flow
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Financeiro</h1>
          <p className="text-support-300">Controle financeiro e comandas</p>
        </div>
        <Button onClick={handleNovaComanda}>
          Nova Comanda
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-900 border border-base-800 rounded-lg p-6">
          <p className="text-sm text-support-300 mb-1">Total do mês</p>
          <p className="text-2xl font-bold">{formatters.currency(totais.total)}</p>
        </div>
        <div className="bg-base-900 border border-base-800 rounded-lg p-6">
          <p className="text-sm text-support-300 mb-1">Recebido</p>
          <p className="text-2xl font-bold text-green-400">{formatters.currency(totais.recebido)}</p>
        </div>
        <div className="bg-base-900 border border-base-800 rounded-lg p-6">
          <p className="text-sm text-support-300 mb-1">A receber</p>
          <p className="text-2xl font-bold text-yellow-400">{formatters.currency(totais.areceber)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(totais.formasPagamento).map(([forma, valor]) => (
          <div key={forma} className="bg-base-900 border border-base-800 rounded-lg p-4">
            <p className="text-sm text-support-300 mb-1">{getFormaPagamentoLabel(forma)}</p>
            <p className="text-lg font-bold">{formatters.currency(valor as number)}</p>
          </div>
        ))}
      </div>

      <FluxoCaixaTable comandas={comandas} onViewComanda={handleVerComanda} />

      <ComandaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        comanda={comandaSelecionada}
        onSave={handleSaveComanda}
      />
    </div>
  )
}
