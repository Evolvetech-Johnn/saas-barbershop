import React from 'react';
import { Comanda } from '@/types/comanda';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';

interface FluxoCaixaTableProps {
  comandas: Comanda[];
  onViewComanda?: (comanda: Comanda) => void;
}

const getFormaPagamentoLabel = (forma: string): string => {
  const labels: Record<string, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
  };
  return labels[forma] || forma;
};

export const FluxoCaixaTable: React.FC<FluxoCaixaTableProps> = ({
  comandas,
  onViewComanda,
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Data/Hora</TableHeader>
            <TableHeader>Cliente</TableHeader>
            <TableHeader>Profissional</TableHeader>
            <TableHeader>Forma Pagamento</TableHeader>
            <TableHeader>Total</TableHeader>
            <TableHeader className="text-right">Ações</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {comandas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-text-muted py-12">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-2xl mb-2 block">💸</span>
                  <p>Nenhuma movimentação financeira encontrada.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            comandas
              .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())
              .map((comanda) => {
                const clienteNome = (comanda.clienteId as any)?.nome || 'Cliente avulso';
                const profissionalNome = (comanda.profissionalId as any)?.nome || 'Profissional não identificado';

                return (
                  <TableRow key={(comanda as any)._id || comanda.id}>
                    <TableCell className="font-medium text-text-primary">
                      {formatDateTime(new Date(comanda.dataHora))}
                    </TableCell>
                    <TableCell>{clienteNome}</TableCell>
                    <TableCell>{profissionalNome}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {getFormaPagamentoLabel(comanda.formaPagamento)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-text-primary">
                      {formatCurrency(comanda.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {onViewComanda && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewComanda(comanda)}
                        >
                          Ver Detalhes
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
