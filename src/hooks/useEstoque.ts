import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Produto } from '@/types/produto';
import { estoqueService } from '@/services/estoqueService';

export const useEstoque = () => {
  const { tenant } = useTenant();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarProdutos = () => {
    if (!tenant) return;
    setLoading(true);
    const dadosProdutos = estoqueService.getProdutosByTenant(tenant.id);
    const dadosEstoqueBaixo = estoqueService.getProdutosEstoqueBaixo(tenant.id);
    setProdutos(dadosProdutos);
    setProdutosEstoqueBaixo(dadosEstoqueBaixo);
    setLoading(false);
  };

  useEffect(() => {
    carregarProdutos();
  }, [tenant]);

  return {
    produtos,
    produtosEstoqueBaixo,
    loading,
    carregarProdutos,
  };
};
