import React, { useState } from 'react';
import { KeyRound, Plus, Trash2, UserX, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useUsuarios } from '@/hooks/useUsuarios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const papelLabel: Record<string, string> = {
  admin: 'Administrador',
  profissional: 'Profissional',
  recepcao: 'Recepção',
  cliente: 'Cliente',
};

export const AcessosEquipe: React.FC = () => {
  const { usuarios, loading, criarUsuario, alternarAtivo, removerUsuario } = useUsuarios();
  const { usuario: usuarioLogado } = useAuth();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [papel, setPapel] = useState<'profissional' | 'recepcao'>('profissional');
  const [salvando, setSalvando] = useState(false);

  const souAdmin = usuarioLogado?.papel === 'admin';

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) {
      addToast('Preencha e-mail e nome.', 'warning');
      return;
    }
    setSalvando(true);
    const senhaTemporaria = await criarUsuario({ email, nome, papel });
    setSalvando(false);
    if (senhaTemporaria) {
      addToast(`Acesso criado! Login: ${email} / Senha temporária: ${senhaTemporaria}`, 'success');
      setIsModalOpen(false);
      setEmail('');
      setNome('');
      setPapel('profissional');
    }
  };

  const handleRemover = (id: string) => {
    if (window.confirm('Remover este acesso? A pessoa não vai mais conseguir logar.')) {
      removerUsuario(id);
    }
  };

  if (!souAdmin) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif font-bold text-base-100 flex items-center gap-2">
            <KeyRound size={20} /> Acessos ao Sistema
          </h2>
          <p className="text-support-300 text-sm mt-1">Contas de login pra funcionários entrarem no painel.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Novo Acesso</span>
        </Button>
      </div>

      {!loading && usuarios.length === 0 && (
        <div className="py-10 text-center bg-base-900 border border-base-800 rounded-2xl">
          <p className="text-support-300">Nenhum acesso de funcionário criado ainda.</p>
        </div>
      )}

      {usuarios.length > 0 && (
        <div className="bg-base-900 border border-base-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-base-900 text-support-300 border-b border-base-800 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">E-mail</th>
                <th className="px-6 py-3 text-center">Papel</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-800">
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-3 text-base-100">{u.nome}</td>
                  <td className="px-6 py-3 text-support-300">{u.email}</td>
                  <td className="px-6 py-3 text-center text-support-200">{papelLabel[u.papel] || u.papel}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={u.ativo ? 'text-green-400' : 'text-support-400'}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    {u.papel !== 'admin' && (
                      <>
                        <Button
                          variant="outline"
                          className="text-xs px-2.5 py-1"
                          onClick={() => alternarAtivo(u.id, !u.ativo)}
                        >
                          {u.ativo ? <UserX size={14} /> : <UserCheck size={14} />}
                        </Button>
                        <Button
                          variant="outline"
                          className="text-xs px-2.5 py-1 border-red-900/50 text-red-400 hover:bg-red-950/20"
                          onClick={() => handleRemover(u.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Acesso pro Funcionário">
        <form onSubmit={handleCriar} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs text-support-300 mb-1">Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Barbeiro" />
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">E-mail (será o login)</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" />
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">Função</label>
            <Select value={papel} onChange={(e) => setPapel(e.target.value as 'profissional' | 'recepcao')}>
              <option value="profissional">Profissional</option>
              <option value="recepcao">Recepção</option>
            </Select>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-base-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? 'Criando...' : 'Criar Acesso'}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
