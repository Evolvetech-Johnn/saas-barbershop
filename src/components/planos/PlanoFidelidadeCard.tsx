import React from 'react';
import { PlanoFidelidade } from '@/types/planoFidelidade';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatters';

interface PlanoFidelidadeCardProps {
  plano: PlanoFidelidade;
  onEdit?: (plano: PlanoFidelidade) => void;
  onDelete?: (planoId: string) => void;
}

export const PlanoFidelidadeCard: React.FC<PlanoFidelidadeCardProps> = ({
  plano,
  onEdit,
  onDelete
}) => {
  return (
    <Card className={`p-6 border-2 ${plano.ativo ? 'border-[var(--tenant-accent)]' : 'border-gray-600 opacity-60'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold font-serif mb-1">{plano.nome}</h3>
          <p className="text-support-300 text-sm">{plano.descricao}</p>
        </div>
        <Badge variant={plano.ativo ? 'default' : 'default'}>
          {plano.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      <div className="mb-6">
        <p className="text-3xl font-bold text-[var(--tenant-accent)]">
          {formatCurrency(plano.precoMensal)}
        </p>
        <p className="text-support-300 text-sm">por mês</p>
      </div>

      <div className="space-y-2 mb-6">
        {plano.beneficios.map((beneficio, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span>
            <span className="text-support-200">{beneficio}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {onEdit && (
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(plano)}>
            Editar
          </Button>
        )}
        {onDelete && (
          <Button variant="secondary" size="sm" className="flex-1 text-red-400" onClick={() => onDelete(plano.id)}>
            Excluir
          </Button>
        )}
      </div>
    </Card>
  );
};
