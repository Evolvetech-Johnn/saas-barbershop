import React, { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { apiRequest } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AprovarSugestaoModal } from './AprovarSugestaoModal';

interface Sugestao {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  descontoSugerido: number;
}

export const SugestoesPromocionais: React.FC = () => {
  const { tenant } = useTenant();
  const { addToast } = useToast();
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSugestao, setSelectedSugestao] = useState<Sugestao | null>(null);

  const fetchSugestoes = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const tenantId = (tenant as any)._id || tenant.id;
      const data = await apiRequest<Sugestao[]>('/promocoes/sugestoes', { method: 'GET' }, tenantId);
      setSugestoes(data || []);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar sugestões de promoções', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    fetchSugestoes();
  }, [fetchSugestoes]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
      </div>
    );
  }

  if (sugestoes.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-2 rounded-xl border border-border-subtle border-dashed">
        <Sparkles className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-text-secondary">Nenhuma sugestão encontrada</h3>
        <p className="text-text-muted mt-2">Clique em "Analisar e Gerar Sugestões" para descobrir oportunidades.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sugestoes.map(sugestao => (
          <div key={sugestao.id} className="relative bg-gradient-to-br from-surface-2 to-surface-1 border border-accent/30 rounded-xl p-6 flex flex-col hover:border-accent hover:shadow-lg transition-all group overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold font-serif mb-2 pr-8">{sugestao.titulo}</h3>
            <p className="text-sm text-text-muted mb-4 flex-1 line-clamp-3">
              {sugestao.descricao}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted uppercase tracking-wider">Desconto Sugerido</span>
                <span className="text-xl font-bold text-accent">{sugestao.descontoSugerido}%</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedSugestao(sugestao)}
                className="group-hover:bg-accent group-hover:text-black group-hover:border-accent transition-colors"
              >
                Editar e Aprovar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedSugestao && (
        <AprovarSugestaoModal
          isOpen={true}
          onClose={() => setSelectedSugestao(null)}
          sugestao={selectedSugestao}
          onSuccess={() => {
            setSelectedSugestao(null);
            fetchSugestoes(); // Refresh the list
            addToast('Promoção aprovada e publicada com sucesso!', 'success');
          }}
        />
      )}
    </>
  );
};
