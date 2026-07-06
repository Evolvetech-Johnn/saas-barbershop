import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Cliente } from '@/types/cliente';
import { clienteService } from '@/services/clienteService';

export const useClientes = () => {
  const { tenant } = useTenant();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = () => {
    if (!tenant) return;
    setLoading(true);
    const dados = clienteService.getClientesByTenant(tenant.id);
    setClientes(dados);
    setLoading(false);
  };

  useEffect(() => {
    carregarClientes();
  }, [tenant]);

  const criarCliente = (data: Omit<Cliente, 'id' | 'tenantId'>) => {
    if (!tenant) return;
    clienteService.createCliente({
      ...data,
      tenantId: tenant.id
    });
    carregarClientes();
  };

  const atualizarCliente = (id: string, data: Partial<Omit<Cliente, 'id' | 'tenantId'>>) => {
    if (!tenant) return;
    clienteService.updateCliente(id, data);
    carregarClientes();
  };

  const excluirCliente = (id: string) => {
    if (!tenant) return;
    clienteService.deleteCliente(id);
    carregarClientes();
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
