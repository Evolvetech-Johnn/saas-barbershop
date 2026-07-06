import React from 'react';
import { Produto } from '@/types/produto';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatters';

interface ProdutoTableProps {
  produtos: Produto[];
  onEdit?: (produto: Produto) => void;
  onDelete?: (produtoId: string) => void;
}

export const ProdutoTable: React.FC<ProdutoTableProps> = ({ produtos, onEdit, onDelete }) => {
  return (
    <div className="bg-base-900 border border-base-800 rounded-lg">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Produto</TableHeader>
            <TableHeader>Categoria</TableHeader>
            <TableHeader>Preço</TableHeader>
            <TableHeader>Quantidade</TableHeader>
            <TableHeader className="text-right">Ações</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {produtos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-support-400 py-8">
                Nenhum produto cadastrado
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell className="font-medium">{produto.nome}</TableCell>
                <TableCell>
                  <Badge variant="default">{produto.categoria}</Badge>
                </TableCell>
                <TableCell className="text-[var(--tenant-accent)]">{formatCurrency(produto.preco)}</TableCell>
                <TableCell>
                  <Badge
                    variant={produto.quantidade <= produto.quantidadeMinima ? 'warning' : 'default'}
                  >
                    {produto.quantidade} un.
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    {onEdit && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit(produto)}>
                        Editar
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="sm" className="text-red-400" onClick={() => onDelete(produto.id)}>
                        Excluir
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
