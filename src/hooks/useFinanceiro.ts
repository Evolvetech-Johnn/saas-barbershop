import { useState, useMemo } from 'react';
import { useComandas } from '@/hooks/useComandas';
import { financeiroService } from '@/services/financeiroService';

export const useFinanceiro = () => {
  const { comandas, loading, criarComanda, atualizarComanda, excluirComanda } = useComandas();

  const dataInicio = new Date();
  dataInicio.setDate(1);
  dataInicio.setHours(0, 0, 0, 0);
  const dataFim = new Date();
  dataFim.setHours(23, 59, 59, 999);

  const [periodo, setPeriodo] = useState({
    inicio: dataInicio,
    fim: dataFim,
  });

  const totais = useMemo(() => {
    return financeiroService.getTotaisByPeriodo(comandas, periodo.inicio, periodo.fim);
  }, [comandas, periodo]);

  return {
    comandas: totais.comandas,
    loading,
    totais,
    periodo,
    setPeriodo,
    criarComanda,
    atualizarComanda,
    excluirComanda,
  };
};
