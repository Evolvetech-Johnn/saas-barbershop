import React, { useEffect, useState } from 'react';
import { superadminService, SaaSInvoice, SaaSRevenueTrend } from '@/services/superadminService';
import { ReceitaSaaSChart } from '@/components/superadmin/ReceitaSaaSChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export const FaturamentoSaaSPage: React.FC = () => {
  const [invoices, setInvoices] = useState<SaaSInvoice[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<SaaSRevenueTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([superadminService.getFaturas(), superadminService.getReceitaTrend()])
      .then(([faturas, trend]) => {
        setInvoices(faturas);
        setRevenueTrend(trend);
      })
      .catch(() => addToast('Erro ao carregar faturamento.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await superadminService.marcarFaturaPaga(invoiceId);
      setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'paga' as const } : inv)));
      addToast('Fatura marcada como paga!', 'success');
    } catch {
      addToast('Erro ao marcar fatura como paga.', 'error');
    }
  };

  const getStatusBadge = (status: SaaSInvoice['status']) => {
    switch (status) {
      case 'paga':
        return <Badge className="bg-green-950 text-green-300 border border-green-800">Paga</Badge>;
      case 'aberta':
        return <Badge className="bg-yellow-950 text-yellow-300 border border-yellow-800">Aberta</Badge>;
      case 'vencida':
        return <Badge className="bg-red-950 text-red-300 border border-red-800">Vencida</Badge>;
      case 'cancelada':
        return <Badge className="bg-base-800 text-support-300 border border-base-750">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPaidRevenue = invoices.filter((inv) => inv.status === 'paga').reduce((acc, inv) => acc + Number(inv.valor), 0);
  const totalPendingRevenue = invoices.filter((inv) => inv.status === 'aberta').reduce((acc, inv) => acc + Number(inv.valor), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-base-100 mb-2">💰 Faturamento do SaaS</h1>
        <p className="text-support-300">Controle financeiro da plataforma e acompanhamento de receita</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-base-900 border border-base-800 p-5">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Receita Coletada</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaidRevenue)}
          </p>
        </Card>
        <Card className="bg-base-900 border border-base-800 p-5">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Receita Pendente (Em Aberto)</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendingRevenue)}
          </p>
        </Card>
        <Card className="bg-base-900 border border-base-800 p-5">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Faturas Totais</p>
          <p className="text-3xl font-bold text-base-100 mt-2">{invoices.length}</p>
        </Card>
      </div>

      {!loading && <ReceitaSaaSChart data={revenueTrend} />}

      {/* Invoice Table */}
      <Card className="bg-base-900 border border-base-800 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-base-100 pb-2 border-b border-base-800">Histórico de Cobrança</h3>

        {loading ? (
          <p className="text-center text-support-400 py-10">Carregando faturas...</p>
        ) : invoices.length === 0 ? (
          <p className="text-center text-support-400 py-10">
            Nenhuma fatura ainda. Elas aparecem aqui assim que a integração de pagamento (Stripe) estiver ativa.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-base-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-base-900 text-support-300 border-b border-base-800 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">Barbearia</th>
                  <th className="px-6 py-4 text-center">Data Venc.</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Valor</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-800">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-base-800/40 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-base-100">{inv.tenant?.nome || '—'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-support-300">
                      {new Date(inv.vencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusBadge(inv.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-base-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(inv.valor))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      {inv.status !== 'paga' ? (
                        <Button
                          onClick={() => handleMarkAsPaid(inv.id)}
                          className="bg-green-900 text-green-100 hover:bg-green-800 px-3 py-1 text-xs"
                        >
                          Marcar Pago
                        </Button>
                      ) : (
                        <span className="text-support-400 font-medium">Pago</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
