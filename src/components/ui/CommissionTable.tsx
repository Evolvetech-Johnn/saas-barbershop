import React from 'react';
import { ProfessionalCommission } from '@/types/report';

interface CommissionTableProps {
  data: ProfessionalCommission[];
}

export const CommissionTable: React.FC<CommissionTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-base-800 shadow-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-base-800 text-base-300 uppercase text-xs tracking-wider">
            <th className="px-4 py-3 text-left">Profissional</th>
            <th className="px-4 py-3 text-right">Comissão (R$)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.professionalId}
              className={`border-t border-base-800 transition-colors duration-150 ${
                i % 2 === 0 ? 'bg-base-900' : 'bg-base-950'
              } hover:bg-base-800`}
            >
              <td className="px-4 py-3 font-medium text-base-100">{row.name}</td>
              <td className="px-4 py-3 text-right text-tenant-accent font-semibold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(row.commission)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-base-800 border-t border-base-700">
            <td className="px-4 py-3 font-bold text-base-100">Total</td>
            <td className="px-4 py-3 text-right font-bold text-tenant-accent">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(data.reduce((acc, r) => acc + r.commission, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
