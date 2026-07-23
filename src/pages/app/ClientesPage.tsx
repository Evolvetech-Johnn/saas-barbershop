import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ClienteCard } from '@/components/clientes/ClienteCard';
import { ClienteForm } from '@/components/clientes/ClienteForm';
import { useClientes } from '@/hooks/useClientes';
import { Cliente } from '@/types/cliente';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Plus, Users } from 'lucide-react';

export const ClientesPage: React.FC = () => {
  const [busca, setBusca] = useState('');
  const { clientes, criarCliente, atualizarCliente, excluirCliente } = useClientes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (cliente.telefone && cliente.telefone.includes(busca))
  );

  const handleOpenNew = () => {
    setClienteSelecionado(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Cliente>) => {
    if (clienteSelecionado) {
      return atualizarCliente((clienteSelecionado as any)._id || clienteSelecionado.id, data);
    } else {
      return criarCliente(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja arquivar este cliente?')) {
      excluirCliente(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description={`${clientes.length} clientes cadastrados`}
        action={
          <Button onClick={handleOpenNew} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Cliente
          </Button>
        }
      />

      <div className="max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-text-muted" />
        </div>
        <Input
          className="pl-10"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {clientesFiltrados.map((cliente) => (
          <ClienteCard
            key={(cliente as any)._id || cliente.id}
            nome={cliente.nome}
            telefone={cliente.telefone}
            email={cliente.email}
            totalAtendimentos={12} // mock for now, ideally would be derived
            ultimoAtendimento={'25/06/2026'} // mock for now, ideally derived
            aniversario={cliente.dataNascimento ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : undefined}
            onEdit={() => handleOpenEdit(cliente)}
            onDelete={() => handleDelete((cliente as any)._id || cliente.id)}
          />
        ))}
        {clientesFiltrados.length === 0 && (
          <div className="col-span-full">
            <EmptyState 
              icon={Users}
              title={busca ? "Nenhum cliente encontrado" : "Sua carteira de clientes está vazia"}
              description={busca ? "Tente buscar por outro termo." : "Cadastre seu primeiro cliente para começar."}
              actionLabel={busca ? undefined : "Novo Cliente"}
              onAction={busca ? undefined : handleOpenNew}
            />
          </div>
        )}
      </div>

      <ClienteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        cliente={clienteSelecionado}
      />
    </div>
  );
};
