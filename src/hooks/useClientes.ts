import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Cliente } from '@/types/cliente';
import { clienteService } from '@/services/clienteService';
import { useToast } from '@/context/ToastContext';

export const useClientes = () => {
  const { tenant } = useTenant();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const carregarClientes = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const dados = await clienteService.getAll(currentId);
      setClientes(dados);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const criarCliente = async (data: Partial<Cliente>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const novo = await clienteService.create(currentId, data);
      setClientes(prev => [novo, ...prev]);
      addToast('Cliente cadastrado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao cadastrar cliente', 'error');
      return false;
    }
  };

  const atualizarCliente = async (id: string, data: Partial<Cliente>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizado = await clienteService.update(currentId, id, data);
      setClientes(prev => prev.map(c => (((c as any)._id || c.id) === ((atualizado as any)._id || atualizado.id) ? atualizado : c)));
      addToast('Cliente atualizado com sucesso!', 'success');
      return true;
    } catch (error) {
      console.error(error);
      addToast('Erro ao atualizar cliente', 'error');
      return false;
    }
  };

  const excluirCliente = async (id: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await clienteService.delete(currentId, id);
      setClientes(prev => prev.filter(c => ((c as any)._id || c.id) !== id));
      addToast('Cliente arquivado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir cliente', 'error');
    }
  };

  return {
    clientes,
    loading,
    criarCliente,
    atualizarCliente,
    excluirCliente,
    carregarClientes,
  };
};
