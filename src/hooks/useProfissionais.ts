import { useState, useEffect, useCallback } from 'react';
import { Profissional } from '@/types/profissional';
import { profissionalService } from '@/services/profissionalService';
import { useTenant } from '@/context/TenantContext';
import { useToast } from '@/context/ToastContext';

export function useProfissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenant();
  const { addToast } = useToast();

  const loadProfissionais = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const data = await profissionalService.getAll(currentId);
      setProfissionais(data);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar equipe', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    loadProfissionais();
  }, [loadProfissionais]);

  const criarProfissional = async (data: Partial<Profissional>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const novo = await profissionalService.create(currentId, data);
      setProfissionais(prev => [novo, ...prev]);
      addToast('Profissional cadastrado!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao cadastrar profissional', 'error');
      return false;
    }
  };

  const atualizarProfissional = async (id: string, data: Partial<Profissional>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizado = await profissionalService.update(currentId, id, data);
      setProfissionais(prev => prev.map(p => (((p as any)._id || p.id) === ((atualizado as any)._id || atualizado.id) ? atualizado : p)));
      addToast('Profissional atualizado!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao atualizar profissional', 'error');
      return false;
    }
  };

  const excluirProfissional = async (id: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await profissionalService.delete(currentId, id);
      setProfissionais(prev => prev.filter(p => ((p as any)._id || p.id) !== id));
      addToast('Profissional arquivado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir profissional', 'error');
    }
  };

  return {
    profissionais,
    loading,
    criarProfissional,
    atualizarProfissional,
    excluirProfissional,
    refresh: loadProfissionais
  };
}
