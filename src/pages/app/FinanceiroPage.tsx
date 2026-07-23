import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useFinanceiro } from '@/hooks/useFinanceiro';

import { FluxoCaixaTable } from '@/components/financeiro/FluxoCaixaTable';
import { ComandaModal } from '@/components/financeiro/ComandaModal';
import { Comanda } from '@/types/comanda';
import { formatters } from '@/utils/formatters';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const getFormaPagamentoLabel = (forma: string): string => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_credito: 'Crédito',
    cartao_debito: 'Débito',
  };
  return labels[forma] || forma;
};

export const FinanceiroPage: React.FC = () => {
  const { totais, comandas } = useFinanceiro();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comandaSelecionada, setComandaSelecionada] = useState<Comanda | undefined>();

  const handleNovaComanda = () => {
    setComandaSelecionada(undefined);
    setIsModalOpen(true);
  };

  const handleVerComanda = (comanda: Comanda) => {
    setComandaSelecionada(comanda);
    setIsModalOpen(true);
  };

  const handleSaveComanda = (_data: Partial<Comanda>) => {
    // Not used in this view – creation is handled via agenda flow
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Financeiro" 
        description="Acompanhe o fluxo de caixa, pagamentos e comandas em tempo real."
        action={
          <Button onClick={handleNovaComanda} className="gap-2">
            <Plus className="w-4 h-4" /> Nova Comanda
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat
          label="Total do Mês"
          value={formatters.currency(totais.total)}
          icon={<Wallet className="w-5 h-5" />}
        />
        <Stat
          label="Recebido"
          value={formatters.currency(totais.recebido)}
          icon={<TrendingUp className="w-5 h-5 text-status-success" />}
        />
        <Stat
          label="A Receber"
          value={formatters.currency(totais.areceber)}
          icon={<TrendingDown className="w-5 h-5 text-status-warning" />}
        />
      </div>

      <div className="bg-surface-1 border border-border-subtle rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-border-subtle pb-4">
          <DollarSign className="w-5 h-5 text-text-muted" />
          <h3 className="text-lg font-serif font-semibold text-text-primary">Formas de Pagamento (Mês)</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(totais.formasPagamento).map(([forma, valor]) => (
            <div key={forma} className="bg-surface-2 border border-border-subtle rounded-lg p-4">
              <p className="text-sm text-text-muted mb-1 font-medium">{getFormaPagamentoLabel(forma)}</p>
              <p className="text-lg font-bold text-text-primary font-serif">{formatters.currency(valor as number)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-1 border border-border-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border-subtle bg-surface-1/50">
          <h3 className="font-semibold text-text-primary">Movimentações</h3>
        </div>
        <FluxoCaixaTable comandas={comandas} onViewComanda={handleVerComanda} />
      </div>

      <ComandaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        comanda={comandaSelecionada}
        onSave={handleSaveComanda}
      />
    </div>
  );
};
