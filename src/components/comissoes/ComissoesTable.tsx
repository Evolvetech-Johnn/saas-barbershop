import React from 'react';
import { ComissaoResumo } from '@/types/comissao';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader } from '@/components/ui/Table';
import { formatCurrency } from '@/utils/formatters';

interface ComissoesTableProps {
  resumo: ComissaoResumo[];
}

export const ComissoesTable: React.FC<ComissoesTableProps> = ({ resumo }) => {
  return (
    <div className="bg-base-900 border border-base-800 rounded-lg">
      <div className="p-4 border-b border-base-800">
        <h3 className="font-semibold">Resumo por Profissional</h3>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Profissional</TableHeader>
            <TableHeader>Atendimentos</TableHeader>
            <TableHeader>Total de Vendas</TableHeader>
            <TableHeader>Total de Comissões</TableHeader>
            <TableHeader className="text-right">%</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-support-400 py-8">
                Nenhuma comissão registrada no período
              </TableCell>
            </TableRow>
          ) : (
            resumo.map((item) => {
              const percentual = item.totalVendas > 0 
                ? ((item.totalComissao / item.totalVendas) * 100).toFixed(1) 
                : '0';
              
              return (
                <TableRow key={item.profissionalId}>
                  <TableCell className="font-medium">{item.profissionalNome}</TableCell>
                  <TableCell>{item.quantidadeAtendimentos}</TableCell>
                  <TableCell>{formatCurrency(item.totalVendas)}</TableCell>
                  <TableCell className="text-[var(--tenant-accent)] font-semibold">{formatCurrency(item.totalComissao)}</TableCell>
                  <TableCell className="text-right">{percentual}%</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
