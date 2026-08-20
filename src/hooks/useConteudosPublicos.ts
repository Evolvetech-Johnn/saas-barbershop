import { useState, useEffect } from 'react';
import { ConteudoPublico } from '@/types/conteudoPublico';
import { getConteudosPublicos } from '@/services/conteudoPublicoService';

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
        if (!isMounted) return;
        setConteudos((data || []).map((c) => ({ ...c, dataPublicacao: new Date(c.dataPublicacao) })));
      } catch (error) {
        console.error('Falha ao buscar conteúdos:', error);
        if (isMounted) setConteudos([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchConteudos();

    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  return { conteudos, isLoading };
};
