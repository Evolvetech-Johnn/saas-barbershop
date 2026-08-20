import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { superadminService, SaaSPlan } from '@/services/superadminService';
import { billingService } from '@/services/billingService';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const formatLimite = (v: number | null) => (v === null ? 'Ilimitado' : v);

export const AssinaturaPage: React.FC = () => {
  const { tenant } = useTenant();
  const { usuario } = useAuth();
  const { addToast } = useToast();
  const [planos, setPlanos] = useState<SaaSPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    superadminService
      .getPlanos()
      .then(setPlanos)
      .catch(() => addToast('Erro ao carregar planos.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkout = searchParams.get('checkout');
    if (checkout === 'sucesso') addToast('Assinatura confirmada! Pode levar alguns segundos para atualizar.', 'success');
    if (checkout === 'cancelado') addToast('Checkout cancelado.', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tenant) return null;

  const handleAssinar = async (plano: SaaSPlan) => {
    setProcessando(plano.id);
    try {
      const { url } = await billingService.criarCheckout((tenant as any)._id || tenant.id, plano.id, usuario?.email);
      window.location.href = url;
    } catch (error: any) {
      addToast(error.message || 'Erro ao iniciar checkout.', 'error');
      setProcessando(null);
    }
  };

  const handleGerenciar = async () => {
    try {
      const { url } = await billingService.abrirPortal((tenant as any)._id || tenant.id);
      window.location.href = url;
    } catch (error: any) {
      addToast(error.message || 'Erro ao abrir portal de cobrança.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Assinatura</h1>
          <p className="text-support-300">
            Plano atual: <span className="font-semibold capitalize text-[var(--tenant-accent)]">{tenant.planoSaas}</span>
          </p>
        </div>
        <Button variant="secondary" onClick={handleGerenciar}>
          Gerenciar cobrança
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-support-400 py-10">Carregando planos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planos.map((plano) => {
            const isAtual = plano.codigo === tenant.planoSaas;
            return (
              <Card key={plano.id} className={`p-6 flex flex-col justify-between border ${isAtual ? 'border-[var(--tenant-accent)]' : 'border-base-800'}`}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{plano.nome}</h3>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-extrabold text-tenant-accent">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.preco)}
                      </span>
                      <span className="text-support-300 text-xs ml-1">/mês</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-sm text-support-200 border-t border-base-800 pt-4">
                    <li className="flex justify-between"><span>Profissionais:</span><span className="font-semibold">{formatLimite(plano.limiteProfissionais)}</span></li>
                    <li className="flex justify-between"><span>Serviços:</span><span className="font-semibold">{formatLimite(plano.limiteServicos)}</span></li>
                    <li className="flex justify-between"><span>Clientes:</span><span className="font-semibold">{formatLimite(plano.limiteClientes)}</span></li>
                  </ul>
                </div>
                <Button
                  className="mt-6 w-full"
                  disabled={isAtual || processando === plano.id}
                  onClick={() => handleAssinar(plano)}
                >
                  {isAtual ? 'Plano atual' : processando === plano.id ? 'Redirecionando...' : 'Assinar este plano'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
