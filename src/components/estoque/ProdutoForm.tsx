import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Produto } from '@/types/produto';

interface ProdutoFormProps {
  isOpen: boolean;
  onClose: () => void;
  produto?: Produto;
  onSave: (data: Partial<Produto>) => Promise<void>;
}

export const ProdutoForm: React.FC<ProdutoFormProps> = ({ isOpen, onClose, produto, onSave }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [custo, setCusto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [quantidadeMinima, setQuantidadeMinima] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (produto) {
      setNome(produto.nome);
      setCategoria(produto.categoria);
      setPreco(produto.preco.toString());
      setCusto(produto.custo.toString());
      setQuantidade(produto.quantidade.toString());
      setQuantidadeMinima(produto.quantidadeMinima.toString());
      setAtivo(produto.ativo);
    } else {
      resetForm();
    }
  }, [produto, isOpen]);

  const resetForm = () => {
    setNome('');
    setCategoria('');
    setPreco('');
    setCusto('');
    setQuantidade('');
    setQuantidadeMinima('');
    setAtivo(true);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      nome,
      categoria,
      preco: parseFloat(preco) || 0,
      custo: parseFloat(custo) || 0,
      quantidade: parseInt(quantidade) || 0,
      quantidadeMinima: parseInt(quantidadeMinima) || 0,
      ativo,
    });
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={produto ? 'Editar Produto' : 'Novo Produto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-support-200 mb-1">
            Nome do Produto *
          </label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Pomada Classic"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Categoria *
            </label>
            <Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              <option value="Cabelo">Cabelo</option>
              <option value="Barba">Barba</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Outros">Outros</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Preço (R$) *
            </label>
            <Input
              type="number"
              step="0.01"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Custo (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              value={custo}
              onChange={(e) => setCusto(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Quantidade *
            </label>
            <Input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Qtd. Mínima *
            </label>
            <Input
              type="number"
              value={quantidadeMinima}
              onChange={(e) => setQuantidadeMinima(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="ativo"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="ativo" className="text-sm text-support-200">
            Produto ativo
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : produto ? 'Salvar Alterações' : 'Criar Produto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
