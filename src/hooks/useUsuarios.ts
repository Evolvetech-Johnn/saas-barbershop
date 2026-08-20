import { useState, useEffect, useCallback } from 'react';
import { usuarioService, UsuarioAcesso } from '@/services/usuarioService';
import { useTenant } from '@/context/TenantContext';
import { useToast } from '@/context/ToastContext';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAcesso[]>([]);
  const [loading, setLoading] = useState(false);
  const { tenant } = useTenant();
  const { addToast } = useToast();

  const currentId = tenant ? ((tenant as any)._id || tenant.id) : undefined;

  const loadUsuarios = useCallback(async () => {
    if (!currentId) return;
    setLoading(true);
    try {
      setUsuarios(await usuarioService.getAll(currentId));
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar acessos', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentId, addToast]);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const criarUsuario = async (data: { email: string; nome: string; papel: 'profissional' | 'recepcao' }): Promise<string | null> => {
    if (!currentId) return null;
    try {
      const novo = await usuarioService.create(currentId, data);
      setUsuarios((prev) => [novo, ...prev]);
      return novo.senhaTemporaria;
    } catch (error: any) {
      addToast(error.message || 'Erro ao criar acesso', 'error');
      return null;
    }
  };

  const alternarAtivo = async (id: string, ativo: boolean) => {
    if (!currentId) return;
    try {
      const atualizado = await usuarioService.update(currentId, id, { ativo });
      setUsuarios((prev) => prev.map((u) => (u.id === id ? atualizado : u)));
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar acesso', 'error');
    }
  };

  const removerUsuario = async (id: string) => {
    if (!currentId) return;
    try {
      await usuarioService.remove(currentId, id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      addToast('Acesso removido!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao remover acesso', 'error');
    }
  };

  return { usuarios, loading, criarUsuario, alternarAtivo, removerUsuario };
}
