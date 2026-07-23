import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Comanda } from '@/types/comanda';
import { comandaService } from '@/services/comandaService';
import { useToast } from '@/context/ToastContext';

export const useComandas = () => {
  const { tenant } = useTenant();
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  const carregarComandas = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const dados = await comandaService.getAll(currentId);
      setComandas(dados);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar comandas', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    carregarComandas();
  }, [carregarComandas]);

  const criarComanda = async (data: Partial<Comanda>) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const nova = await comandaService.create(currentId, data);
      setComandas(prev => [nova, ...prev]);
      addToast('Comanda criada com sucesso', 'success');
      return true;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Erro ao criar comanda', 'error');
      return false;
    }
  };

  const atualizarComanda = async (comandaId: string, data: Partial<Comanda>) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizada = await comandaService.update(currentId, comandaId, data);
      setComandas(prev => prev.map(c => (((c as any)._id || c.id) === ((atualizada as any)._id || atualizada.id) ? atualizada : c)));
      addToast('Comanda atualizada com sucesso', 'success');
      return true;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Erro ao atualizar comanda', 'error');
      return false;
    }
  };

  const excluirComanda = async (comandaId: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await comandaService.delete(currentId, comandaId);
      setComandas(prev => prev.filter(c => ((c as any)._id || c.id) !== comandaId));
      addToast('Comanda excluída com sucesso', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir comanda', 'error');
    }
  };

  return {
    comandas,
    loading,
    carregarComandas,
    criarComanda,
    atualizarComanda,
    excluirComanda,
  };
};
