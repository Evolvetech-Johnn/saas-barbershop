import React, { useState } from 'react';
import { mockSaaSPlans, SaaSPlan } from '@/data/mockSaaS';
import { PlanoSaaSCard } from '@/components/superadmin/PlanoSaaSCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export const PlanosSaaSPage: React.FC = () => {
  const [plans, setPlans] = useState<SaaSPlan[]>(mockSaaSPlans);
  const [selectedPlan, setSelectedPlan] = useState<SaaSPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // Edit fields state
  const [editPreco, setEditPreco] = useState('');
  const [editLimitProfissionais, setEditLimitProfissionais] = useState('');
  const [editLimitServicos, setEditLimitServicos] = useState('');

  const handleEditPlanClick = (plan: SaaSPlan) => {
    setSelectedPlan(plan);
    setEditPreco(String(plan.preco));
    setEditLimitProfissionais(String(plan.limiteProfissionais));
    setEditLimitServicos(String(plan.limiteServicos));
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const updatedPrice = parseFloat(editPreco);
    if (isNaN(updatedPrice)) {
      addToast('O preço do plano deve ser um valor numérico válido!', 'warning');
      return;
    }

    setPlans(prev => prev.map(p => {
      if (p.id === selectedPlan.id) {
        return {
          ...p,
          preco: updatedPrice,
          limiteProfissionais: editLimitProfissionais === 'ilimitado' ? 'ilimitado' : parseInt(editLimitProfissionais) || 0,
          limiteServicos: editLimitServicos === 'ilimitado' ? 'ilimitado' : parseInt(editLimitServicos) || 0,
        };
      }
      return p;
    }));

    setIsModalOpen(false);
    addToast('Preço e limites do plano atualizados com sucesso!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-base-100 mb-2">📋 Planos do SaaS</h1>
        <p className="text-support-300">Monitore e configure os planos de assinatura disponibilizados na plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanoSaaSCard 
            key={plan.id} 
            plan={plan} 
            onEdit={handleEditPlanClick} 
          />
        ))}
      </div>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configurar Plano: ${selectedPlan?.nome}`}
      >
        {selectedPlan && (
          <form onSubmit={handleSavePlan} className="space-y-4 mt-2">
            <div>
              <label className="block text-xs text-support-300 mb-1">Preço Mensal (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={editPreco}
                onChange={(e) => setEditPreco(e.target.value)}
                className="bg-base-950 border-base-800 text-base-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-support-300 mb-1">Limite de Profissionais</label>
              <Input
                value={editLimitProfissionais}
                onChange={(e) => setEditLimitProfissionais(e.target.value)}
                placeholder="Ex: 5 ou ilimitado"
                className="bg-base-950 border-base-800 text-base-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-support-300 mb-1">Limite de Serviços</label>
              <Input
                value={editLimitServicos}
                onChange={(e) => setEditLimitServicos(e.target.value)}
                placeholder="Ex: 10 ou ilimitado"
                className="bg-base-950 border-base-800 text-base-100 text-sm"
              />
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-base-800">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-base-800 border border-base-750 text-base-100 hover:bg-base-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[var(--tenant-accent)] text-base-950 hover:opacity-90 font-medium"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
