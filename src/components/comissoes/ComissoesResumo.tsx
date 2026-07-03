import React from 'react';
import { ComissaoResumo } from '@/types/comissao';
import { formatCurrency } from '@/utils/formatters';

interface ComissoesResumoProps {
  resumo: ComissaoResumo[];
}

export const ComissoesResumo: React.FC<ComissoesResumoProps> = ({ resumo }) => {
  const totalGeral = resumo.reduce((sum, item) => sum + item.totalComissao, 0);
  const totalVendasGeral = resumo.reduce((sum, item) => sum + item.totalVendas, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-base-900 border border-base-800 rounded-lg p-6">
        <p className="text-sm text-support-300 mb-1">Total de Comissões</p>
        <p className="text-2xl font-bold text-[var(--tenant-accent)]">{formatCurrency(totalGeral)}</p>
      </div>
      <div className="bg-base-900 border border-base-800 rounded-lg p-6">
        <p className="text-sm text-support-300 mb-1">Total de Vendas</p>
        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalVendasGeral)}</p>
      </div>
      <div className="bg-base-900 border border-base-800 rounded-lg p-6">
        <p className="text-sm text-support-300 mb-1">Profissionais</p>
        <p className="text-2xl font-bold">{resumo.length}</p>
      </div>
      <div className="bg-base-900 border border-base-800 rounded-lg p-6">
        <p className="text-sm text-support-300 mb-1">Atendimentos</p>
        <p className="text-2xl font-bold">{resumo.reduce((sum, item) => sum + item.quantidadeAtendimentos, 0)}</p>
      </div>
    </div>
  );
};
