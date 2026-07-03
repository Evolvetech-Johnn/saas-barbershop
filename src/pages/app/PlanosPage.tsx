import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { usePlanos } from '@/hooks/usePlanos';
import { PlanoFidelidadeCard } from '@/components/planos/PlanoFidelidadeCard';
import { PlanoFidelidadeForm } from '@/components/planos/PlanoFidelidadeForm';
import { PlanoFidelidade } from '@/types/planoFidelidade';
import { planosService } from '@/services/planosService';
import { useTenant } from '@/context/TenantContext';

export const PlanosPage: React.FC = () => {
  const { tenant } = useTenant();
  const { planos, carregarPlanos } = usePlanos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planoEditar, setPlanoEditar] = useState<PlanoFidelidade | undefined>();

  const handleNovoPlano = () => {
    setPlanoEditar(undefined);
    setIsModalOpen(true);
  };

  const handleEditarPlano = (plano: PlanoFidelidade) => {
    setPlanoEditar(plano);
    setIsModalOpen(true);
  };

  const handleExcluirPlano = (planoId: string) => {
    if (tenant && window.confirm('Tem certeza que deseja excluir este plano?')) {
      planosService.deletePlano(tenant.id, planoId);
      carregarPlanos();
    }
  };

  const handleSalvarPlano = (data: Omit<PlanoFidelidade, 'id' | 'tenantId'>) => {
    if (!tenant) return;
    if (planoEditar) {
      planosService.updatePlano(tenant.id, planoEditar.id, data);
    } else {
      planosService.createPlano(tenant.id, data);
    }
    carregarPlanos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Planos de Fidelidade</h1>
          <p className="text-support-300">
            {planos.length} plano{planos.length !== 1 ? 's' : ''} cadastrado{planos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleNovoPlano}>
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <PlanoFidelidadeCard
            key={plano.id}
            plano={plano}
            onEdit={handleEditarPlano}
            onDelete={handleExcluirPlano}
          />
        ))}
      </div>

      {planos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-support-300">Nenhum plano de fidelidade cadastrado</p>
        </div>
      )}

      <PlanoFidelidadeForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plano={planoEditar}
        onSave={handleSalvarPlano}
      />
    </div>
  );
};
