import React from 'react';
import { Produto } from '@/types/produto';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AlertaEstoqueBaixoProps {
  produtos: Produto[];
}

export const AlertaEstoqueBaixo: React.FC<AlertaEstoqueBaixoProps> = ({ produtos }) => {
  if (produtos.length === 0) return null;

  return (
    <Card className="border-yellow-500 bg-yellow-500/10 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-yellow-500 text-xl">⚠️</div>
        <div>
          <h4 className="font-semibold text-yellow-400 mb-2">
            Atenção: {produtos.length} produto{produtos.length > 1 ? 's' : ''} com estoque baixo
          </h4>
          <div className="flex flex-wrap gap-2">
            {produtos.map((produto) => (
              <Badge key={produto.id} variant="warning">
                {produto.nome} - {produto.quantidade} un.
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
