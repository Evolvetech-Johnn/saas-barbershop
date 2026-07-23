import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Cliente } from '@/types/cliente';

interface ClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Cliente>) => Promise<boolean>;
  cliente?: Cliente | null;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  isOpen,
  onClose,
  onSave,
  cliente
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    dataNascimento: '',
    observacoes: '',
    ativo: true,
  });

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome || '',
        telefone: cliente.telefone || '',
        email: cliente.email || '',
        dataNascimento: cliente.dataNascimento ? new Date(cliente.dataNascimento).toISOString().split('T')[0] : '',
        observacoes: cliente.observacoes || '',
        ativo: cliente.ativo !== undefined ? cliente.ativo : true,
      });
    } else {
      setFormData({
        nome: '',
        telefone: '',
        email: '',
        dataNascimento: '',
        observacoes: '',
        ativo: true,
      });
    }
  }, [cliente, isOpen]);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) return;

    setLoading(true);
    const success = await onSave({
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email || undefined,
      dataNascimento: formData.dataNascimento ? new Date(formData.dataNascimento) : undefined,
      observacoes: formData.observacoes || undefined,
      ativo: formData.ativo,
    });
    setLoading(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cliente ? "Editar Cliente" : "Novo Cliente"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-support-200 mb-2">Nome *</label>
          <Input
            required
            placeholder="Nome completo"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Telefone *</label>
          <Input
            required
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">E-mail</label>
          <Input
            type="email"
            placeholder="cliente@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Data de Nascimento</label>
          <Input
            type="date"
            value={formData.dataNascimento}
            onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-support-200 mb-2">Observações</label>
          <textarea
            className="w-full bg-base-900 border border-base-800 rounded-md p-2 text-support-100 focus:outline-none focus:border-[var(--tenant-accent)] min-h-[80px]"
            placeholder="Alergias, preferências, etc."
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
