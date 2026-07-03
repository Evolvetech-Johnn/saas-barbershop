import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantSaaSDetails } from '@/data/mockSaaS';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TenantsTableProps {
  tenants: TenantSaaSDetails[];
  onToggleStatus: (id: string) => void;
}

export const TenantsTable: React.FC<TenantsTableProps> = ({ tenants, onToggleStatus }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: TenantSaaSDetails['status']) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-950 text-green-300 border border-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge className="bg-base-800 text-support-300 border border-base-750">Suspenso</Badge>;
      case 'vencido':
        return <Badge className="bg-red-950 text-red-300 border border-red-800">Vencido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: TenantSaaSDetails['planoSaas']) => {
    switch (plan) {
      case 'premium':
        return <Badge className="bg-yellow-950 text-yellow-300 border border-yellow-800">Premium</Badge>;
      case 'pro':
        return <Badge className="bg-blue-950 text-blue-300 border border-blue-800">Pro</Badge>;
      case 'start':
        return <Badge className="bg-base-800 text-base-300 border border-base-700">Start</Badge>;
      default:
        return <Badge>{plan}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-base-800 bg-base-900/50 backdrop-blur-sm shadow-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-base-900 text-support-300 border-b border-base-800 text-xs font-semibold uppercase tracking-wider">
            <th className="px-6 py-4 text-left">Empresa</th>
            <th className="px-6 py-4 text-left">Slug</th>
            <th className="px-6 py-4 text-center">Plano</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-left">Data de Adesão</th>
            <th className="px-6 py-4 text-right">Faturamento Est.</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-800">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-base-800/40 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="font-semibold text-base-100">{tenant.nome}</span>
                  <span className="text-xs text-support-400">{tenant.contatoEmail}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-support-300">
                /{tenant.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {getPlanBadge(tenant.planoSaas)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {getStatusBadge(tenant.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-support-300">
                {new Date(tenant.dataCriacao).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-base-200">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tenant.faturamentoMensal)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                <Button 
                  onClick={() => onToggleStatus(tenant.id)}
                  variant="outline" 
                  className={`text-xs px-2.5 py-1 ${
                    tenant.status === 'ativo' 
                      ? 'border-red-900/50 text-red-400 hover:bg-red-950/20' 
                      : 'border-green-900/50 text-green-400 hover:bg-green-950/20'
                  }`}
                >
                  {tenant.status === 'ativo' ? 'Suspender' : 'Ativar'}
                </Button>
                <Button 
                  onClick={() => navigate(`/admin/tenants/${tenant.id}`)}
                  className="text-xs px-2.5 py-1 bg-base-800 border border-base-750 text-base-100 hover:bg-base-700"
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
          {tenants.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-support-400">
                Nenhum tenant encontrado com os filtros atuais.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
