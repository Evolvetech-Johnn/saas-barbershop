import React, { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateSlug } from '@/utils/slug';

export const ConfiguracoesTenantForm: React.FC = () => {
  const { tenant, updateTenant } = useTenant();
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    corAcento: '#d4af37',
    descricaoPublica: '',
    endereco: '',
    telefone: '',
    horarioFuncionamento: '',
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        nome: tenant.nome || '',
        slug: tenant.slug || '',
        corAcento: tenant.corAcento || '#d4af37',
        descricaoPublica: tenant.descricaoPublica || '',
        endereco: tenant.endereco || '',
        telefone: tenant.telefone || '',
        horarioFuncionamento: tenant.horarioFuncionamento || '',
      });
    }
  }, [tenant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'nome' && { slug: generateSlug(value) })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) {
      addToast('O nome da barbearia é obrigatório.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      await updateTenant(formData);
      addToast('Configurações salvas com sucesso!', 'success');
    } catch (error) {
      addToast('Erro ao salvar configurações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!tenant) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Dados Básicos</h2>
          <div>
            <label className="block text-sm text-support-200 mb-2">Nome da Barbearia *</label>
            <Input
              name="nome"
              required
              value={formData.nome}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Slug (URL pública)</label>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Cor de Acento</label>
            <div className="flex gap-3 mt-2">
              {['#d4af37', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, corAcento: color }))}
                  className={`w-10 h-10 rounded-full border-2 ${
                    formData.corAcento === color ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Informações Públicas</h2>
          <div>
            <label className="block text-sm text-support-200 mb-2">Descrição Pública</label>
            <textarea
              name="descricaoPublica"
              value={formData.descricaoPublica}
              onChange={handleInputChange}
              className="w-full bg-base-900 border border-base-800 rounded-lg p-3 text-support-100 focus:outline-none focus:border-[var(--tenant-accent)] h-24 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Endereço</label>
            <Input
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Telefone</label>
            <Input
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm text-support-200 mb-2">Horário de Funcionamento</label>
            <Input
              name="horarioFuncionamento"
              value={formData.horarioFuncionamento}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end pt-6 border-t border-base-800">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </form>
  );
};
