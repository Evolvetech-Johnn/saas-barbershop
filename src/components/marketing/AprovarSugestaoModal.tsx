import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTenant } from '@/context/TenantContext';
import { apiRequest } from '@/config/api';

interface Sugestao {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  descontoSugerido: number;
}

interface AprovarSugestaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sugestao: Sugestao;
  onSuccess: () => void;
}

export const AprovarSugestaoModal: React.FC<AprovarSugestaoModalProps> = ({
  isOpen,
  onClose,
  sugestao,
  onSuccess
}) => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: sugestao.titulo,
    descricao: sugestao.descricao,
    dataInicio: sugestao.dataInicio.split('T')[0],
    dataFim: sugestao.dataFim.split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return;

    setLoading(true);
    try {
      const tenantId = (tenant as any)._id || tenant.id;
      // Ajustar datas para enviar ao backend garantindo o formato correto
      const payload = {
        ...formData,
        dataInicio: new Date(formData.dataInicio).toISOString(),
        dataFim: new Date(formData.dataFim).toISOString(),
      };

      await apiRequest(`/promocoes/aprovar-sugestao/${sugestao.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }, tenantId);
      
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-1 rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-surface-2/50">
          <h2 className="text-xl font-serif font-semibold text-text-primary">Aprovar Promoção</h2>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-3 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-accent font-medium mb-1">Dica da IA</p>
            <p className="text-xs text-text-secondary">Sugerimos um desconto de <strong>{sugestao.descontoSugerido}%</strong> para atrair clientes. Você pode ajustar a descrição abaixo para refletir este desconto.</p>
          </div>

          <form id="aprovar-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Título da Promoção</label>
              <input 
                name="titulo"
                type="text"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-text-secondary">Descrição</label>
              <textarea 
                name="descricao"
                required
                rows={4}
                value={formData.descricao}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Data de Início</label>
                <input 
                  name="dataInicio"
                  type="date"
                  required
                  value={formData.dataInicio}
                  onChange={handleChange}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-secondary">Data de Fim</label>
                <input 
                  name="dataFim"
                  type="date"
                  required
                  value={formData.dataFim}
                  onChange={handleChange}
                  className="w-full bg-surface-2 border border-border-strong rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle bg-surface-2/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" form="aprovar-form" isLoading={loading} className="min-w-[140px]">
            Aprovar e Publicar
          </Button>
        </div>
      </div>
    </div>
  );
};
