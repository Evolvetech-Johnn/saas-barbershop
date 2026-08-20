import React, { useEffect, useState } from 'react';
import { superadminService, SaaSPlan } from '@/services/superadminService';
import { PlanoSaaSCard } from '@/components/superadmin/PlanoSaaSCard';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export const PlanosSaaSPage: React.FC = () => {
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SaaSPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const [editPreco, setEditPreco] = useState('');
  const [editLimitProfissionais, setEditLimitProfissionais] = useState('');
  const [editLimitServicos, setEditLimitServicos] = useState('');

  useEffect(() => {
    superadminService
      .getPlanos()
      .then(setPlans)
      .catch(() => addToast('Erro ao carregar planos.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditPlanClick = (plan: SaaSPlan) => {
    setSelectedPlan(plan);
    setEditPreco(String(plan.preco));
    setEditLimitProfissionais(plan.limiteProfissionais === null ? 'ilimitado' : String(plan.limiteProfissionais));
    setEditLimitServicos(plan.limiteServicos === null ? 'ilimitado' : String(plan.limiteServicos));
    setIsModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const updatedPrice = parseFloat(editPreco);
    if (isNaN(updatedPrice)) {
      addToast('O preço do plano deve ser um valor numérico válido!', 'warning');
      return;
    }

    const limiteProfissionais = editLimitProfissionais === 'ilimitado' ? null : parseInt(editLimitProfissionais) || 0;
    const limiteServicos = editLimitServicos === 'ilimitado' ? null : parseInt(editLimitServicos) || 0;

    try {
      const atualizado = await superadminService.updatePlano(selectedPlan.id, { preco: updatedPrice, limiteProfissionais, limiteServicos });
      setPlans((prev) => prev.map((p) => (p.id === selectedPlan.id ? { ...p, ...atualizado } : p)));
      setIsModalOpen(false);
      addToast('Preço e limites do plano atualizados com sucesso!', 'success');
    } catch {
      addToast('Erro ao salvar o plano.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-base-100 mb-2">📋 Planos do SaaS</h1>
        <p className="text-support-300">Monitore e configure os planos de assinatura disponibilizados na plataforma</p>
      </div>

      {loading ? (
        <p className="text-center text-support-400 py-10">Carregando planos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanoSaaSCard key={plan.id} plan={plan} onEdit={handleEditPlanClick} />
          ))}
        </div>
      )}

      {/* Edit Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Configurar Plano: ${selectedPlan?.nome}`}>
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
              <Button type="submit" className="bg-[var(--tenant-accent)] text-base-950 hover:opacity-90 font-medium">
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
