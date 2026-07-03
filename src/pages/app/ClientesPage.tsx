import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ClienteCard } from '@/components/clientes/ClienteCard'
import { ClienteForm } from '@/components/clientes/ClienteForm'
import { useClientes } from '@/hooks/useClientes'
import { Cliente } from '@/types/cliente'

export const ClientesPage: React.FC = () => {
  const [busca, setBusca] = useState('')
  const { clientes, criarCliente, atualizarCliente, excluirCliente } = useClientes()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca)
  )

  const handleOpenNew = () => {
    setClienteSelecionado(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cliente: Cliente) => {
    setClienteSelecionado(cliente)
    setIsModalOpen(true)
  }

  const handleSave = (data: Omit<Cliente, 'id' | 'tenantId'>) => {
    if (clienteSelecionado) {
      atualizarCliente(clienteSelecionado.id, data)
    } else {
      criarCliente(data)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja arquivar este cliente?')) {
      excluirCliente(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Clientes</h1>
          <p className="text-support-300">
            {clientes.length} clientes cadastrados
          </p>
        </div>
        <Button onClick={handleOpenNew}>Novo Cliente</Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente) => (
          <ClienteCard
            key={cliente.id}
            nome={cliente.nome}
            telefone={cliente.telefone}
            email={cliente.email}
            totalAtendimentos={12} // mock for now, ideally would be derived
            ultimoAtendimento={'25/06/2026'} // mock for now, ideally derived
            aniversario={cliente.dataNascimento ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}) : undefined}
            onEdit={() => handleOpenEdit(cliente)}
            onDelete={() => handleDelete(cliente.id)}
          />
        ))}
        {clientesFiltrados.length === 0 && (
          <div className="col-span-full text-center py-12 bg-base-900 border border-base-800 rounded-lg">
            <p className="text-support-300">Nenhum cliente encontrado.</p>
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
  )
}
