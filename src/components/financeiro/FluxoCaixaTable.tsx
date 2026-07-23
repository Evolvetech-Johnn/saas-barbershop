import React from 'react';
import { Comanda } from '@/types/comanda';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/Table';
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
    <div className="bg-base-900 border border-base-800 rounded-lg">
      <div className="p-4 border-b border-base-800">
        <h3 className="font-semibold">Fluxo de Caixa</h3>
      </div>
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
              <TableCell colSpan={6} className="text-center text-support-400 py-8">
                Nenhuma comanda encontrada
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
                    <TableCell>{formatDateTime(new Date(comanda.dataHora))}</TableCell>
                    <TableCell>{clienteNome}</TableCell>
                    <TableCell>{profissionalNome}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-base-800 text-support-200">
                        {getFormaPagamentoLabel(comanda.formaPagamento)}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(comanda.total)}
                    </TableCell>
                    <TableCell className="text-right">
                      {onViewComanda && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onViewComanda(comanda)}
                        >
                          Ver
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
