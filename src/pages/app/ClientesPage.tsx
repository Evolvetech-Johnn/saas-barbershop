import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ClienteCard } from '@/components/clientes/ClienteCard'

const mockClientes = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao@email.com',
    totalAtendimentos: 12,
    ultimoAtendimento: '02/07/2025',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '(11) 91234-5678',
    email: 'maria@email.com',
    totalAtendimentos: 8,
    ultimoAtendimento: '28/06/2025',
    aniversario: '12/07',
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    telefone: '(11) 99876-5432',
    email: 'pedro@email.com',
    totalAtendimentos: 15,
    ultimoAtendimento: '30/06/2025',
  },
  {
    id: '4',
    nome: 'Lucas Ferreira',
    telefone: '(11) 91111-2222',
    email: 'lucas@email.com',
    totalAtendimentos: 5,
    ultimoAtendimento: '25/06/2025',
  },
]

export const ClientesPage: React.FC = () => {
  const [busca, setBusca] = useState('')

  const clientesFiltrados = mockClientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.includes(busca)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Clientes</h1>
          <p className="text-support-300">
            {mockClientes.length} clientes cadastrados
          </p>
        </div>
        <Button>Novo Cliente</Button>
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
            totalAtendimentos={cliente.totalAtendimentos}
            ultimoAtendimento={cliente.ultimoAtendimento}
            aniversario={cliente.aniversario}
          />
        ))}
      </div>
    </div>
  )
}
