import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Comanda, FormaPagamento, ItemComanda } from '@/types/comanda';
import { formatCurrency } from '@/utils/formatters';
import { mockData } from '@/data/mockData';
import { useTenant } from '@/context/TenantContext';

interface ComandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  comanda?: Comanda;
  onSave?: (comanda: Omit<Comanda, 'id' | 'tenantId' | 'dataHora'>) => void;
}

export const ComandaModal: React.FC<ComandaModalProps> = ({
  isOpen,
  onClose,
  comanda,
  onSave,
}) => {
  const { tenant } = useTenant();
  const [clienteId, setClienteId] = useState<string>('');
  const [profissionalId, setProfissionalId] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [desconto, setDesconto] = useState<string>('');
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [novoItemTipo, setNovoItemTipo] = useState<'servico' | 'produto'>('servico');
  const [novoItemId, setNovoItemId] = useState<string>('');
  const [novoItemQuantidade, setNovoItemQuantidade] = useState<string>('1');

  const clientes = tenant ? mockData.clientes.filter((c) => c.tenantId === tenant.id) : [];
  const profissionais = tenant ? mockData.profissionais.filter((p) => p.tenantId === tenant.id) : [];
  const servicos = tenant ? mockData.servicos.filter((s) => s.tenantId === tenant.id) : [];
  const produtos = tenant ? mockData.produtos.filter((p) => p.tenantId === tenant.id) : [];

  useEffect(() => {
    if (comanda) {
      setClienteId(comanda.clienteId || '');
      setProfissionalId(comanda.profissionalId);
      setFormaPagamento(comanda.formaPagamento);
      setDesconto(comanda.desconto?.toString() || '');
      setItens(comanda.itens);
    } else {
      resetForm();
    }
  }, [comanda, isOpen]);

  const resetForm = () => {
    setClienteId('');
    setProfissionalId('');
    setFormaPagamento('pix');
    setDesconto('');
    setItens([]);
    setNovoItemTipo('servico');
    setNovoItemId('');
    setNovoItemQuantidade('1');
  };

  const adicionarItem = () => {
    if (!novoItemId || !novoItemQuantidade) return;

    const quantidade = parseInt(novoItemQuantidade);
    if (quantidade <= 0) return;

    let item: ItemComanda | null = null;

    if (novoItemTipo === 'servico') {
      const servico = servicos.find((s) => s.id === novoItemId);
      if (servico) {
        item = {
          tipo: 'servico',
          itemId: servico.id,
          nome: servico.nome,
          quantidade,
          precoUnitario: servico.preco,
        };
      }
    } else {
      const produto = produtos.find((p) => p.id === novoItemId);
      if (produto) {
        item = {
          tipo: 'produto',
          itemId: produto.id,
          nome: produto.nome,
          quantidade,
          precoUnitario: produto.preco,
        };
      }
    }

    if (item) {
      setItens([...itens, item]);
      setNovoItemId('');
      setNovoItemQuantidade('1');
    }
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    const subtotal = itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
    const desc = parseFloat(desconto) || 0;
    return subtotal - desc;
  };

  const handleSave = () => {
    if (!profissionalId || itens.length === 0) return;

    onSave?.({
      clienteId: clienteId || undefined,
      profissionalId,
      itens,
      formaPagamento,
      desconto: parseFloat(desconto) || undefined,
      total: calcularTotal(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={comanda ? 'Editar Comanda' : 'Nova Comanda'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Cliente
            </label>
            <Select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Profissional *
            </label>
            <Select
              value={profissionalId}
              onChange={(e) => setProfissionalId(e.target.value)}
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map((profissional) => (
                <option key={profissional.id} value={profissional.id}>
                  {profissional.nome}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="border border-base-800 rounded-lg p-4">
          <h4 className="font-medium mb-3">Itens</h4>
          <div className="grid grid-cols-12 gap-2 mb-3">
            <div className="col-span-3">
              <Select
                value={novoItemTipo}
                onChange={(e) => setNovoItemTipo(e.target.value as 'servico' | 'produto')}
              >
                <option value="servico">Serviço</option>
                <option value="produto">Produto</option>
              </Select>
            </div>
            <div className="col-span-5">
              <Select
                value={novoItemId}
                onChange={(e) => setNovoItemId(e.target.value)}
              >
                <option value="">Selecione</option>
                {novoItemTipo === 'servico'
                  ? servicos.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nome} - {formatCurrency(s.preco)}
                      </option>
                    ))
                  : produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} - {formatCurrency(p.preco)}
                      </option>
                    ))}
              </Select>
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                min="1"
                value={novoItemQuantidade}
                onChange={(e) => setNovoItemQuantidade(e.target.value)}
                placeholder="Qtd"
              />
            </div>
            <div className="col-span-2">
              <Button onClick={adicionarItem} className="w-full">
                +
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {itens.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-base-800 rounded px-3 py-2"
              >
                <div>
                  <span className="font-medium">{item.nome}</span>
                  <span className="text-support-400 text-sm ml-2">
                    x{item.quantidade}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {formatCurrency(item.precoUnitario * item.quantidade)}
                  </span>
                  <button
                    onClick={() => removerItem(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Forma de Pagamento *
            </label>
            <Select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">PIX</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-support-200 mb-1">
              Desconto (R$)
            </label>
            <Input
              type="number"
              min="0"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="bg-base-800 rounded-lg p-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Total</span>
            <span className="font-bold text-[var(--tenant-accent)]">
              {formatCurrency(calcularTotal())}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {comanda ? 'Atualizar' : 'Criar Comanda'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
