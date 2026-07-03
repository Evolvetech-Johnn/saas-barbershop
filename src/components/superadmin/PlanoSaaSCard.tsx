import React from 'react';
import { SaaSPlan } from '@/data/mockSaaS';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PlanoSaaSCardProps {
  plan: SaaSPlan;
  onEdit: (plan: SaaSPlan) => void;
}

export const PlanoSaaSCard: React.FC<PlanoSaaSCardProps> = ({ plan, onEdit }) => {
  return (
    <Card className="bg-base-900 border border-base-800 p-6 flex flex-col justify-between hover:border-base-700 transition-all duration-300 relative overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-3 bg-base-800 text-xs text-support-300 font-medium rounded-bl-lg">
        {plan.totalAssinantes} assinante{plan.totalAssinantes !== 1 ? 's' : ''}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-base-100">{plan.nome}</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-extrabold text-tenant-accent">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.preco)}
            </span>
            <span className="text-support-300 text-xs ml-1">/mês</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-base-800 pt-4">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Limites do Plano</p>
          <ul className="space-y-1.5 text-sm text-support-200">
            <li className="flex justify-between">
              <span>Profissionais:</span>
              <span className="font-semibold text-base-100">{plan.limiteProfissionais}</span>
            </li>
            <li className="flex justify-between">
              <span>Serviços:</span>
              <span className="font-semibold text-base-100">{plan.limiteServicos}</span>
            </li>
            <li className="flex justify-between">
              <span>Clientes:</span>
              <span className="font-semibold text-base-100">{plan.limiteClientes}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2 border-t border-base-800 pt-4">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Recursos inclusos</p>
          <ul className="space-y-1 text-xs text-support-300">
            {plan.recursos.map((recurso, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>{recurso}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-base-800 pt-4">
        <Button 
          onClick={() => onEdit(plan)}
          className="w-full bg-base-800 border border-base-750 text-base-100 hover:bg-base-700 font-medium"
        >
          Editar Preço &amp; Limites
        </Button>
      </div>
    </Card>
  );
};
