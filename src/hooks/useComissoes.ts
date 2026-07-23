import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Comissao, ComissaoResumo } from '@/types/comissao';
import { comissoesService } from '@/services/comissoesService';
import { useToast } from '@/context/ToastContext';

export const useComissoes = () => {
  const { tenant } = useTenant();
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [resumo, setResumo] = useState<ComissaoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const dataInicio = new Date();
  dataInicio.setDate(1);
  dataInicio.setHours(0, 0, 0, 0);
  const dataFim = new Date();
  dataFim.setHours(23, 59, 59, 999);

  const [periodo, setPeriodo] = useState({
    inicio: dataInicio,
    fim: dataFim,
  });

  const carregarComissoes = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const dadosComissoes = await comissoesService.getAll(currentId);
      
      // Calculate summary locally based on period
      const filtradas = dadosComissoes.filter((c) => {
        const d = new Date(c.dataHora);
        return d >= periodo.inicio && d <= periodo.fim;
      });

      const porProfissional = filtradas.reduce((acc, c) => {
        const profId = (c.profissionalId as any)?._id || c.profissionalId;
        const profNome = (c.profissionalId as any)?.nome || 'Profissional';
        
        if (!acc[profId]) {
          acc[profId] = {
            profissionalId: profId,
            profissionalNome: profNome,
            totalComissao: 0,
            totalVendas: 0, // Na api real precisariamos puxar do populate ou do total da comanda
            quantidadeAtendimentos: 0
          };
        }

        acc[profId].totalComissao += c.valor;
        acc[profId].quantidadeAtendimentos += 1;
        // Approximation if we don't have total vendas
        acc[profId].totalVendas += (c.valor / (c.percentual / 100));

        return acc;
      }, {} as Record<string, ComissaoResumo>);

      setComissoes(dadosComissoes);
      setResumo(Object.values(porProfissional));
    } catch (error: any) {
      console.error(error);
      addToast('Erro ao carregar comissões', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, periodo, addToast]);

  const pagarComissao = async (id: string) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await comissoesService.pagar(currentId, id);
      addToast('Comissão marcada como paga', 'success');
      await carregarComissoes();
      return true;
    } catch (error: any) {
      console.error(error);
      addToast('Erro ao pagar comissão', 'error');
      return false;
    }
  };

  useEffect(() => {
    carregarComissoes();
  }, [carregarComissoes]);

  return {
    comissoes,
    resumo,
    loading,
    periodo,
    setPeriodo,
    carregarComissoes,
    pagarComissao,
  };
};
