import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTenantsDetails } from '@/data/mockSaaS';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const TenantDetalhePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tenant = mockTenantsDetails.find(t => t.id === id);

  if (!tenant) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-2xl font-bold text-base-100">Barbearia não encontrada</h2>
        <p className="text-support-300">O identificador do tenant informado é inválido.</p>
        <Button onClick={() => navigate('/admin/tenants')}>Voltar para Lista</Button>
      </div>
    );
  }

  const getStatusBadge = (status: typeof tenant.status) => {
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

  const getPlanBadge = (plan: typeof tenant.planoSaas) => {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => navigate('/admin/tenants')}
          variant="outline"
          className="text-xs bg-base-900 border-base-800 text-base-100 hover:bg-base-800"
        >
          ← Voltar
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold text-base-100">{tenant.nome}</h1>
            {getPlanBadge(tenant.planoSaas)}
            {getStatusBadge(tenant.status)}
          </div>
          <p className="text-support-300 text-sm mt-1">Slug da URL: <span className="font-mono">/{tenant.slug}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="bg-base-900 border border-base-800 p-6 space-y-4 lg:col-span-1">
          <h3 className="text-lg font-semibold text-base-100 border-b border-base-800 pb-2">Informações Básicas</h3>
          <div className="space-y-3 text-sm text-support-200">
            <div>
              <p className="text-xs text-support-400">E-mail Administrativo</p>
              <p className="font-medium text-base-100 mt-0.5">{tenant.contatoEmail}</p>
            </div>
            <div>
              <p className="text-xs text-support-400">Telefone</p>
              <p className="font-medium text-base-100 mt-0.5">{tenant.contatoTelefone}</p>
            </div>
            <div>
              <p className="text-xs text-support-400">Data de Criação</p>
              <p className="font-medium text-base-100 mt-0.5">{new Date(tenant.dataCriacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-xs text-support-400">Próximo Vencimento da Licença</p>
              <p className="font-medium text-base-100 mt-0.5">{new Date(tenant.dataVencimentoPlano).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-base-900 border border-base-800 p-4">
              <p className="text-xs text-support-300 uppercase">Faturamento Estimado</p>
              <p className="text-2xl font-bold text-base-100 mt-1">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tenant.faturamentoMensal)}
              </p>
            </Card>
            <Card className="bg-base-900 border border-base-800 p-4">
              <p className="text-xs text-support-300 uppercase">Agendamentos</p>
              <p className="text-2xl font-bold text-base-100 mt-1">{tenant.agendamentosRealizados}</p>
            </Card>
            <Card className="bg-base-900 border border-base-800 p-4">
              <p className="text-xs text-support-300 uppercase">Clientes</p>
              <p className="text-2xl font-bold text-base-100 mt-1">{tenant.clientesCadastrados}</p>
            </Card>
            <Card className="bg-base-900 border border-base-800 p-4">
              <p className="text-xs text-support-300 uppercase">Profissionais</p>
              <p className="text-2xl font-bold text-base-100 mt-1">{tenant.profissionaisCadastrados}</p>
            </Card>
          </div>

          {/* Usage Metrics Simulation */}
          <Card className="bg-base-900 border border-base-800 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-base-100 border-b border-base-800 pb-2">Status do Tenant</h3>
            <p className="text-sm text-support-200">
              Esta empresa está configurada no plano <span className="font-semibold text-tenant-accent capitalize">{tenant.planoSaas}</span> e possui limite de profissionais e clientes conforme acordado na assinatura. O status atual indica que a licença de uso está válida.
            </p>
            <div className="flex gap-4 pt-2">
              <Button className="bg-[var(--tenant-accent)] text-base-950 font-medium hover:opacity-90">
                Alterar Plano SaaS
              </Button>
              <Button variant="outline" className="border-base-750 text-base-100 hover:bg-base-800">
                Enviar E-mail de Suporte
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
