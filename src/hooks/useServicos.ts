import { useState, useEffect, useCallback } from 'react';
import { Servico } from '@/types/servico';
import { servicoService } from '@/services/servicoService';
import { useTenant } from '@/context/TenantContext';
import { useToast } from '@/context/ToastContext';

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenant();
  const { addToast } = useToast();

  const loadServicos = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const data = await servicoService.getAll(currentId);
      setServicos(data);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar serviços', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

  const criarServico = async (data: Partial<Servico>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const novo = await servicoService.create(currentId, data);
      setServicos(prev => [novo, ...prev]);
      addToast('Serviço cadastrado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao cadastrar serviço', 'error');
      return false;
    }
  };

  const atualizarServico = async (id: string, data: Partial<Servico>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizado = await servicoService.update(currentId, id, data);
      setServicos(prev => prev.map(s => (((s as any)._id || s.id) === ((atualizado as any)._id || atualizado.id) ? atualizado : s)));
      addToast('Serviço atualizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao atualizar serviço', 'error');
      return false;
    }
  };

  const excluirServico = async (id: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await servicoService.delete(currentId, id);
      setServicos(prev => prev.filter(s => ((s as any)._id || s.id) !== id));
      addToast('Serviço arquivado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir serviço', 'error');
    }
  };

  return {
    servicos,
    loading,
    criarServico,
    atualizarServico,
    excluirServico,
    refresh: loadServicos
  };
}
