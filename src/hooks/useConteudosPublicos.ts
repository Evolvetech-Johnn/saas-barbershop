import { useState, useEffect } from 'react';
import { ConteudoPublico } from '@/types/conteudoPublico';
import { getConteudosPublicos } from '@/services/conteudoPublicoService';
import { mockConteudos } from '@/data/mockConteudos';

export const useConteudosPublicos = (tenantId: string | undefined) => {
  const [conteudos, setConteudos] = useState<ConteudoPublico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tenantId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchConteudos = async () => {
      try {
        setIsLoading(true);
        const data = await getConteudosPublicos(tenantId);
        
        if (isMounted) {
          if (data && data.length > 0) {
            const parsedData = data.map(c => ({
              ...c,
              dataPublicacao: new Date(c.dataPublicacao),
            }));
            
            setConteudos(parsedData);
          } else {
            fallbackToMock();
          }
        }
      } catch (error) {
        console.error('Falha ao buscar conteúdos reais, usando fallback mock:', error);
        if (isMounted) fallbackToMock();
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const fallbackToMock = () => {
      const mockValidos = mockConteudos
        .filter((cont) => cont.tenantId === tenantId && cont.ativo)
        .sort((a, b) => b.dataPublicacao.getTime() - a.dataPublicacao.getTime());
      setConteudos(mockValidos);
    };

    fetchConteudos();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  return { conteudos, isLoading };
};
