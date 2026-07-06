import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PlanoFidelidade } from '@/types/planoFidelidade';

interface PlanoFidelidadeFormProps {
  isOpen: boolean;
  onClose: () => void;
  plano?: PlanoFidelidade;
  onSave: (data: Omit<PlanoFidelidade, 'id' | 'tenantId'>) => void;
}

export const PlanoFidelidadeForm: React.FC<PlanoFidelidadeFormProps> = ({
  isOpen,
  onClose,
  plano,
  onSave
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoMensal, setPrecoMensal] = useState('');
  const [beneficios, setBeneficios] = useState<string[]>([]);
  const [novoBeneficio, setNovoBeneficio] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (plano) {
      setNome(plano.nome);
      setDescricao(plano.descricao);
      setPrecoMensal(plano.precoMensal.toString());
      setBeneficios(plano.beneficios);
      setAtivo(plano.ativo);
    } else {
      resetForm();
    }
  }, [plano, isOpen]);

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setPrecoMensal('');
    setBeneficios([]);
    setNovoBeneficio('');
    setAtivo(true);
  };

  const adicionarBeneficio = () => {
    if (novoBeneficio.trim()) {
      setBeneficios([...beneficios, novoBeneficio.trim()]);
      setNovoBeneficio('');
    }
  };

  const removerBeneficio = (index: number) => {
    setBeneficios(beneficios.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome,
      descricao,
      precoMensal: parseFloat(precoMensal) || 0,
      beneficios,
      ativo
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plano ? 'Editar Plano de Fidelidade' : 'Novo Plano de Fidelidade'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-support-200 mb-1">
            Nome do Plano *
          </label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Plano Premium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-support-200 mb-1">
            Descrição
          </label>
          <Input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Para clientes frequentes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-support-200 mb-1">
            Preço Mensal (R$) *
          </label>
          <Input
            type="number"
            step="0.01"
            value={precoMensal}
            onChange={(e) => setPrecoMensal(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-support-200 mb-1">
            Benefícios
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={novoBeneficio}
              onChange={(e) => setNovoBeneficio(e.target.value)}
              placeholder="Adicionar benefício"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarBeneficio())}
            />
            <Button type="button" onClick={adicionarBeneficio}>
              +
            </Button>
          </div>
          <div className="space-y-1">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-center justify-between bg-base-800 rounded px-3 py-2">
                <span className="text-sm">{beneficio}</span>
                <button
                  type="button"
                  onClick={() => removerBeneficio(index)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ativoPlano"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="ativoPlano" className="text-sm text-support-200">
            Plano ativo
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {plano ? 'Salvar Alterações' : 'Criar Plano'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
