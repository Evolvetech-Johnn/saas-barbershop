import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SugestoesPromocionais } from '@/components/marketing/SugestoesPromocionais';
import { useTenant } from '@/context/TenantContext';
import { apiRequest } from '@/config/api';

export const MarketingPage: React.FC = () => {
  const { tenant } = useTenant();
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGerarSugestoes = async () => {
    if (!tenant) return;
    setIsGenerating(true);
    try {
      const tenantId = (tenant as any)._id || tenant.id;
      await apiRequest('/promocoes/gerar-sugestoes', { method: 'POST' }, tenantId);
      setRefreshKey(prev => prev + 1); // Trigger refresh in child component
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marketing Inteligente" 
        description="Aproveite nossos algoritmos para identificar horários ociosos e criar promoções matadoras." 
        action={{
          label: isGenerating ? 'Analisando...' : 'Analisar e Gerar Sugestões',
          onClick: handleGerarSugestoes,
          disabled: isGenerating
        }}
      />
      
      <div className="bg-surface-1 rounded-xl p-6 border border-border-subtle shadow-sm">
        <h2 className="text-xl font-serif font-semibold mb-2">Sugestões de Promoções (IA)</h2>
        <p className="text-text-muted mb-6">
          Com base no histórico dos seus agendamentos dos últimos 30 dias, o sistema identificou os períodos com menor movimento e preparou estas ofertas para você atrair mais clientes. 
          Basta editar e aprovar para publicá-las!
        </p>

        <SugestoesPromocionais key={refreshKey} />
      </div>
    </div>
  );
};
