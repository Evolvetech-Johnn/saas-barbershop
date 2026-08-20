import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateSlug } from '@/utils/slug';
import { uploadService } from '@/services/uploadService';

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
    logoUrl: '',
  });
  const [imagensGaleria, setImagensGaleria] = useState<string[]>([]);
  const [novaImagemUrl, setNovaImagemUrl] = useState('');
  const [enviandoLogo, setEnviandoLogo] = useState(false);
  const [enviandoGaleria, setEnviandoGaleria] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  const tenantId = tenant ? ((tenant as any)._id || tenant.id) : undefined;

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !tenantId) return;
    setEnviandoLogo(true);
    try {
      const url = await uploadService.uploadImagem(tenantId, file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
      addToast('Logo enviada! Clique em Salvar para confirmar.', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao enviar a logo.', 'error');
    } finally {
      setEnviandoLogo(false);
    }
  };

  const handleUploadGaleria = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !tenantId) return;
    setEnviandoGaleria(true);
    try {
      const url = await uploadService.uploadImagem(tenantId, file);
      setImagensGaleria((prev) => [...prev, url]);
      addToast('Foto enviada! Clique em Salvar para confirmar.', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao enviar a foto.', 'error');
    } finally {
      setEnviandoGaleria(false);
    }
  };

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
        logoUrl: tenant.logoUrl || '',
      });
      setImagensGaleria(tenant.imagensGaleria || []);
    }
  }, [tenant]);

  const handleAddImagem = () => {
    const url = novaImagemUrl.trim();
    if (!url) return;
    setImagensGaleria((prev) => [...prev, url]);
    setNovaImagemUrl('');
  };

  const handleRemoveImagem = (index: number) => {
    setImagensGaleria((prev) => prev.filter((_, i) => i !== index));
  };

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
      await updateTenant({ ...formData, imagensGaleria });
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
            <label className="block text-sm text-support-200 mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {formData.logoUrl && (
                <img src={formData.logoUrl} alt="Logo" className="w-14 h-14 rounded-full object-cover border border-base-800" />
              )}
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleUploadLogo} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                disabled={enviandoLogo}
                className="flex items-center gap-2"
              >
                <Upload size={16} /> {enviandoLogo ? 'Enviando...' : 'Enviar Logo'}
              </Button>
            </div>
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

      <div className="pt-6 border-t border-base-800 space-y-4">
        <h2 className="text-xl font-semibold">Galeria de Fotos</h2>
        <p className="text-sm text-support-300 -mt-2">Envie fotos do seu espaço/trabalho, ou cole o link de uma imagem já hospedada. Elas aparecem na sua página pública.</p>

        <div className="flex flex-wrap gap-2">
          <input ref={galeriaInputRef} type="file" accept="image/*" onChange={handleUploadGaleria} className="hidden" />
          <Button
            type="button"
            variant="outline"
            onClick={() => galeriaInputRef.current?.click()}
            disabled={enviandoGaleria}
            className="flex items-center gap-2"
          >
            <Upload size={16} /> {enviandoGaleria ? 'Enviando...' : 'Enviar Foto'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="ou cole o link de uma imagem: https://..."
            value={novaImagemUrl}
            onChange={(e) => setNovaImagemUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImagem();
              }
            }}
          />
          <Button type="button" variant="outline" onClick={handleAddImagem} className="flex items-center gap-2 shrink-0">
            <Plus size={16} /> Adicionar
          </Button>
        </div>

        {imagensGaleria.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagensGaleria.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-base-800 bg-base-900 group">
                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImagem(index)}
                  className="absolute top-2 right-2 p-1.5 bg-base-950/80 text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remover"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end pt-6 border-t border-base-800">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </form>
  );
};
