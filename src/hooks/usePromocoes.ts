import { useState, useEffect } from 'react';
import { Promocao } from '@/types/promocao';
import { getPromocoesPublicas } from '@/services/promocaoService';
import { mockPromocoes } from '@/data/mockPromocoes';

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
        
        if (isMounted) {
          if (data && data.length > 0) {
            const parsedData = data.map(p => ({
              ...p,
              dataInicio: new Date(p.dataInicio),
              dataFim: new Date(p.dataFim),
            }));
            
            const hoje = new Date();
            const validas = parsedData.filter(p => p.ativo && p.dataFim >= hoje);
            
            if (validas.length > 0) {
              setPromocoes(validas);
            } else {
              fallbackToMock();
            }
          } else {
            fallbackToMock();
          }
        }
      } catch (error) {
        console.error('Falha ao buscar promoções reais, usando fallback mock:', error);
        if (isMounted) fallbackToMock();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const fallbackToMock = () => {
      const hoje = new Date();
      const mockValidas = mockPromocoes.filter(
        (promo) => promo.tenantId === tenantId && promo.ativo && promo.dataFim >= hoje
      );
      setPromocoes(mockValidas);
    };

    fetchPromocoes();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  return { promocoes, isLoading };
};
