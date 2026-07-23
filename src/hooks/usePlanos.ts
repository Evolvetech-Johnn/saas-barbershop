import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { planosService } from '@/services/planosService';
import { PlanoFidelidade, AssinaturaPlano } from '@/types/planoFidelidade';
import { useToast } from '@/context/ToastContext';

export const usePlanos = () => {
  const { tenant } = useTenant();
  const [planos, setPlanos] = useState<PlanoFidelidade[]>([]);
  const [assinaturas, setAssinaturas] = useState<AssinaturaPlano[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const carregarDados = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const [dadosPlanos, dadosAssinaturas] = await Promise.all([
        planosService.getPlanosByTenant(currentId),
        planosService.getAssinaturas(currentId)
      ]);
      setPlanos(dadosPlanos);
      setAssinaturas(dadosAssinaturas);
    } catch (error: any) {
      console.error(error);
      addToast('Erro ao carregar planos/assinaturas', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  const assinar = async (clienteId: string, planoId: string) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await planosService.assinarPlano(currentId, clienteId, planoId);
      addToast('Assinatura criada com sucesso', 'success');
      await carregarDados();
      return true;
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao criar assinatura';
      addToast(msg, 'error');
      return false;
    }
  };

  const cancelar = async (assinaturaId: string) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await planosService.cancelarAssinatura(currentId, assinaturaId);
      addToast('Assinatura cancelada', 'success');
      await carregarDados();
      return true;
    } catch (error: any) {
      console.error(error);
      addToast('Erro ao cancelar assinatura', 'error');
      return false;
    }
  };

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  return {
    planos,
    assinaturas,
    loading,
    carregarDados,
    assinar,
    cancelar,
  };
};
