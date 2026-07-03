import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useEstoque } from '@/hooks/useEstoque';
import { AlertaEstoqueBaixo } from '@/components/estoque/AlertaEstoqueBaixo';
import { ProdutoTable } from '@/components/estoque/ProdutoTable';
import { ProdutoForm } from '@/components/estoque/ProdutoForm';
import { Produto } from '@/types/produto';
import { estoqueService } from '@/services/estoqueService';
import { useTenant } from '@/context/TenantContext';

export const EstoquePage: React.FC = () => {
  const { tenant } = useTenant();
  const { produtos, produtosEstoqueBaixo, carregarProdutos } = useEstoque();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEditar, setProdutoEditar] = useState<Produto | undefined>();

  const handleNovoProduto = () => {
    setProdutoEditar(undefined);
    setIsModalOpen(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditar(produto);
    setIsModalOpen(true);
  };

  const handleExcluirProduto = (produtoId: string) => {
    if (tenant && window.confirm('Tem certeza que deseja excluir este produto?')) {
      estoqueService.deleteProduto(tenant.id, produtoId);
      carregarProdutos();
    }
  };

  const handleSalvarProduto = (data: Omit<Produto, 'id' | 'tenantId'>) => {
    if (!tenant) return;
    if (produtoEditar) {
      estoqueService.updateProduto(tenant.id, produtoEditar.id, data);
    } else {
      estoqueService.createProduto(tenant.id, data);
    }
    carregarProdutos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Estoque</h1>
          <p className="text-support-300">
            {produtos.length} produto{produtos.length !== 1 ? 's' : ''} cadastrado{produtos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNovoProduto}>
          Novo Produto
        </Button>
      </div>

      <AlertaEstoqueBaixo produtos={produtosEstoqueBaixo} />

      <ProdutoTable
        produtos={produtos}
        onEdit={handleEditarProduto}
        onDelete={handleExcluirProduto}
      />

      <ProdutoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        produto={produtoEditar}
        onSave={handleSalvarProduto}
      />
    </div>
  );
};
