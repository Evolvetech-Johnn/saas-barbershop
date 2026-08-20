import { useState, useEffect } from 'react';
import { Promocao } from '@/types/promocao';
import { getPromocoesPublicas } from '@/services/promocaoService';

export const usePromocoes = (tenantId: string | undefined) => {
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchPromocoes = async () => {
      try {
        setIsLoading(true);
        const data = await getPromocoesPublicas(tenantId);
        if (!isMounted) return;

        const parsedData = (data || []).map((p) => ({ ...p, dataInicio: new Date(p.dataInicio), dataFim: new Date(p.dataFim) }));
        const hoje = new Date();
        setPromocoes(parsedData.filter((p) => p.ativo && p.dataFim >= hoje));
      } catch (error) {
        console.error('Falha ao buscar promoções:', error);
        if (isMounted) setPromocoes([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPromocoes();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  return { promocoes, isLoading };
};
