import { Cliente } from '@/types/cliente';
import { mockData } from '@/data/mockData';

const STORAGE_KEY = 'barbearia_clientes';

// Initialize local storage with mockData if empty
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData.clientes));
}

export const clienteService = {
  getClientes: (): Cliente[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((c: any) => ({
        ...c,
        dataNascimento: c.dataNascimento ? new Date(c.dataNascimento) : undefined
      }));
    } catch (e) {
      console.error('Error parsing clientes from localStorage', e);
      return [];
    }
  },

  getClientesByTenant: (tenantId: string): Cliente[] => {
    return clienteService.getClientes().filter(c => c.tenantId === tenantId && c.ativo);
  },

  saveClientes: (clientes: Cliente[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
  },

  createCliente: (cliente: Omit<Cliente, 'id'>): Cliente => {
    const clientes = clienteService.getClientes();
    const novoCliente: Cliente = {
      ...cliente,
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    clientes.push(novoCliente);
    clienteService.saveClientes(clientes);
    return novoCliente;
  },

  updateCliente: (id: string, data: Partial<Omit<Cliente, 'id' | 'tenantId'>>): Cliente | null => {
    const clientes = clienteService.getClientes();
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCliente = { ...clientes[index], ...data };
    clientes[index] = updatedCliente;
    clienteService.saveClientes(clientes);
    return updatedCliente;
  },

  deleteCliente: (id: string): boolean => {
    const clientes = clienteService.getClientes();
    const index = clientes.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    // Soft delete
    clientes[index].ativo = false;
    clienteService.saveClientes(clientes);
    return true;
  }
};
