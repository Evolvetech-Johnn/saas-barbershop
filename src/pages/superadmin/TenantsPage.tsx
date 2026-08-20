import React, { useEffect, useState } from 'react';
import { superadminService, TenantSaaSDetails } from '@/services/superadminService';
import { TenantsTable } from '@/components/superadmin/TenantsTable';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<TenantSaaSDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [planFilter, setPlanFilter] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  // Add Tenant Form State
  const [newNome, setNewNome] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newPlano, setNewPlano] = useState<'start' | 'pro' | 'premium'>('start');
  const [newEmail, setNewEmail] = useState('');
  const [newTelefone, setNewTelefone] = useState('');

  const loadTenants = () => {
    setLoading(true);
    superadminService
      .getTenants()
      .then(setTenants)
      .catch(() => addToast('Erro ao carregar barbearias.', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTenants = tenants.filter((t) => t.status === 'ativo').length;
  const expiredTenants = tenants.filter((t) => t.status === 'vencido').length;

  const totalMRR = tenants.reduce((acc, tenant) => {
    if (tenant.status !== 'ativo') return acc;
    switch (tenant.planoSaas) {
      case 'premium':
        return acc + 199.9;
      case 'pro':
        return acc + 99.9;
      case 'start':
        return acc + 49.9;
      default:
        return acc;
    }
  }, 0);

  const handleToggleStatus = async (id: string) => {
    const tenant = tenants.find((t) => t.id === id);
    if (!tenant) return;
    const newStatus = tenant.status === 'ativo' ? 'inativo' : 'ativo';
    try {
      await superadminService.setTenantStatus(id, newStatus);
      setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
      addToast(`Tenant ${tenant.nome} ${newStatus === 'ativo' ? 'ativado' : 'suspenso'}!`, 'info');
    } catch {
      addToast('Erro ao atualizar status do tenant.', 'error');
    }
  };

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome || !newSlug || !newEmail) {
      addToast('Nome, Slug e E-mail são obrigatórios!', 'warning');
      return;
    }

    try {
      const criado = await superadminService.createTenant({
        nome: newNome,
        slug: newSlug.toLowerCase().replace(/\s+/g, '-'),
        planoSaas: newPlano,
        email: newEmail,
        telefone: newTelefone,
      });
      setIsModalOpen(false);
      if (criado.senhaTemporaria) {
        addToast(`Barbearia cadastrada! Login: ${newEmail} / Senha temporária: ${criado.senhaTemporaria}`, 'success');
      } else {
        addToast('Nova Barbearia cadastrada com sucesso!', 'success');
      }
      setNewNome('');
      setNewSlug('');
      setNewPlano('start');
      setNewEmail('');
      setNewTelefone('');
      loadTenants();
    } catch {
      addToast('Erro ao cadastrar barbearia.', 'error');
    }
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.contatoEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || t.status === statusFilter;
    const matchesPlan = planFilter === 'todos' || t.planoSaas === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-base-100 mb-2">🏢 Gerenciamento de Tenants</h1>
          <p className="text-support-300">Controle as barbearias cadastradas na plataforma</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--tenant-accent)] text-base-950 hover:opacity-90 font-medium"
        >
          Nova Barbearia
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-base-900 border border-base-800 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Faturamento SaaS (MRR)</p>
          <p className="text-3xl font-bold text-tenant-accent mt-2">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMRR)}
          </p>
        </Card>
        <Card className="bg-base-900 border border-base-800 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Total de Barbearias</p>
          <p className="text-3xl font-bold text-base-100 mt-2">{tenants.length}</p>
        </Card>
        <Card className="bg-base-900 border border-base-800 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Assinaturas Ativas</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{activeTenants}</p>
        </Card>
        <Card className="bg-base-900 border border-base-800 p-5 flex flex-col justify-between">
          <p className="text-xs font-semibold text-support-300 uppercase tracking-wider">Assinaturas Vencidas</p>
          <p className="text-3xl font-bold text-red-400 mt-2">{expiredTenants}</p>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="bg-base-900 border border-base-800 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <Input
              placeholder="Buscar por nome, slug ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-base-950 border-base-800 text-base-100 text-sm"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="w-1/2 md:w-36">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-base-950 border-base-800 text-base-100 text-sm w-full"
              >
                <option value="todos">Todos Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Suspenso</option>
                <option value="vencido">Vencido</option>
              </Select>
            </div>
            <div className="w-1/2 md:w-36">
              <Select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="bg-base-950 border-base-800 text-base-100 text-sm w-full"
              >
                <option value="todos">Todos Planos</option>
                <option value="start">Start</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-support-400 py-10">Carregando barbearias...</p>
        ) : (
          <TenantsTable tenants={filteredTenants} onToggleStatus={handleToggleStatus} />
        )}
      </Card>

      {/* Add Tenant Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Nova Barbearia (Tenant)">
        <form onSubmit={handleAddTenant} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs text-support-300 mb-1">Nome da Barbearia</label>
            <Input
              placeholder="Ex: Barbearia da Esquina"
              value={newNome}
              onChange={(e) => setNewNome(e.target.value)}
              className="bg-base-950 border-base-800 text-base-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">Slug da URL pública</label>
            <Input
              placeholder="Ex: esquina (ficará /esquina)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="bg-base-950 border-base-800 text-base-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">Plano SaaS Inicial</label>
            <Select
              value={newPlano}
              onChange={(e) => setNewPlano(e.target.value as 'start' | 'pro' | 'premium')}
              className="bg-base-950 border-base-800 text-base-100 text-sm w-full"
            >
              <option value="start">Start (R$ 49,90/mês)</option>
              <option value="pro">Pro (R$ 99,90/mês)</option>
              <option value="premium">Premium (R$ 199,90/mês)</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">E-mail de Contato</label>
            <Input
              type="email"
              placeholder="admin@barbearia.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-base-950 border-base-800 text-base-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-support-300 mb-1">Telefone</label>
            <Input
              placeholder="(11) 98888-7777"
              value={newTelefone}
              onChange={(e) => setNewTelefone(e.target.value)}
              className="bg-base-950 border-base-800 text-base-100 text-sm"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-base-800">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-base-800 border border-base-750 text-base-100 hover:bg-base-700"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-[var(--tenant-accent)] text-base-950 hover:opacity-90 font-medium">
              Cadastrar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
