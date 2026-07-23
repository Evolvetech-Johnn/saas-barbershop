import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Produto } from '@/types/produto';
import { estoqueService } from '@/services/estoqueService';
import { useToast } from '@/context/ToastContext';

export const useEstoque = () => {
  const { tenant } = useTenant();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosEstoqueBaixo, setProdutosEstoqueBaixo] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const carregarProdutos = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const dados = await estoqueService.getAll(currentId);
      setProdutos(dados);
      setProdutosEstoqueBaixo(dados.filter(p => p.quantidade <= p.quantidadeMinima));
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const criarProduto = async (data: Partial<Produto>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const novo = await estoqueService.create(currentId, data);
      setProdutos(prev => [...prev, novo]);
      addToast('Produto cadastrado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao cadastrar produto', 'error');
      return false;
    }
  };

  const atualizarProduto = async (id: string, data: Partial<Produto>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizado = await estoqueService.update(currentId, id, data);
      setProdutos(prev => prev.map(p => (((p as any)._id || p.id) === ((atualizado as any)._id || atualizado.id) ? atualizado : p)));
      addToast('Produto atualizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao atualizar produto', 'error');
      return false;
    }
  };

  const excluirProduto = async (id: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await estoqueService.delete(currentId, id);
      setProdutos(prev => prev.filter(p => ((p as any)._id || p.id) !== id));
      addToast('Produto excluído com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir produto', 'error');
    }
  };

  return {
    produtos,
    produtosEstoqueBaixo,
    loading,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    carregarProdutos,
  };
};
