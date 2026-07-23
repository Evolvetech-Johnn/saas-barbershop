import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Comanda, FormaPagamento, ItemComanda } from '@/types/comanda';
import { formatCurrency } from '@/utils/formatters';
import { useClientes } from '@/hooks/useClientes';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useServicos } from '@/hooks/useServicos';
import { useEstoque } from '@/hooks/useEstoque';
import { useTenant } from '@/context/TenantContext';
import { usePlanos } from '@/hooks/usePlanos';
interface ComandaModalProps {
  isOpen: boolean;
  onClose: () => void;
  comanda?: Comanda;
  onSave?: (comanda: Partial<Comanda>) => void;
}

export const ComandaModal: React.FC<ComandaModalProps> = ({
  isOpen,
  onClose,
  comanda,
  onSave,
}) => {
  useTenant();
  const { assinaturas } = usePlanos();
  const { clientes } = useClientes();
  const { profissionais } = useProfissionais();
  const { servicos } = useServicos();
  const { produtos } = useEstoque();

  const [clienteId, setClienteId] = useState<string>('');
  const [profissionalId, setProfissionalId] = useState<string>('');
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('pix');
  const [desconto, setDesconto] = useState<string>('');
  const [itens, setItens] = useState<ItemComanda[]>([]);
  const [novoItemTipo, setNovoItemTipo] = useState<'servico' | 'produto'>('servico');
  const [novoItemId, setNovoItemId] = useState<string>('');
  const [novoItemQuantidade, setNovoItemQuantidade] = useState<string>('1');

  // Verifica se o cliente tem assinatura ativa
  const assinaturaAtiva = assinaturas.find(
    (ass) => ass.status === 'ativo' && (ass.clienteId as any)?._id === clienteId || ass.clienteId === clienteId
  );
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
      const servico = servicos.find((s) => ((s as any)._id || s.id) === novoItemId);
      if (servico) {
        item = {
          tipo: 'servico',
          itemId: ((servico as any)._id || servico.id),
          nome: servico.nome,
          quantidade,
          precoUnitario: servico.preco,
        };
      }
    } else {
      const produto = produtos.find((p) => ((p as any)._id || p.id) === novoItemId);
      if (produto) {
        item = {
          tipo: 'produto',
          itemId: ((produto as any)._id || produto.id),
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
    let subtotal = itens.reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
    
    // Se tem assinatura, todos os SERVIÇOS saem de graça (100% desconto)
    if (assinaturaAtiva) {
      const totalServicos = itens
        .filter(item => item.tipo === 'servico')
        .reduce((sum, item) => sum + item.precoUnitario * item.quantidade, 0);
      
      subtotal -= totalServicos;
    }

    const desc = parseFloat(desconto) || 0;
    return Math.max(subtotal - desc, 0);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-support-200 mb-1">
              Cliente
              {assinaturaAtiva && (
                <span className="bg-[var(--tenant-accent)] text-base-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  ASSINANTE VIP
                </span>
              )}
            </label>
            <Select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => {
                const id = (cliente as any)._id || cliente.id;
                return (
                  <option key={id} value={id}>
                    {cliente.nome}
                  </option>
                )
              })}
            </Select>
            {assinaturaAtiva && (
              <p className="text-xs text-[var(--tenant-accent)] mt-1">
                Serviços possuem 100% de desconto automático.
              </p>
            )}
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
              {profissionais.map((profissional) => {
                const id = (profissional as any)._id || profissional.id;
                return (
                  <option key={id} value={id}>
                    {profissional.nome}
                  </option>
                )
              })}
            </Select>
          </div>
        </div>

        <div className="border border-base-800 rounded-lg p-4">
          <h4 className="font-medium mb-3">Itens</h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
            <div className="col-span-1 sm:col-span-3">
              <Select
                value={novoItemTipo}
                onChange={(e) => setNovoItemTipo(e.target.value as 'servico' | 'produto')}
              >
                <option value="servico">Serviço</option>
                <option value="produto">Produto</option>
              </Select>
            </div>
            <div className="col-span-1 sm:col-span-5">
              <Select
                value={novoItemId}
                onChange={(e) => setNovoItemId(e.target.value)}
              >
                <option value="">Selecione</option>
                {novoItemTipo === 'servico'
                  ? servicos.map((s) => {
                      const id = (s as any)._id || s.id;
                      return (
                        <option key={id} value={id}>
                          {s.nome} - {formatCurrency(s.preco)}
                        </option>
                      )
                    })
                  : produtos.map((p) => {
                      const id = (p as any)._id || p.id;
                      return (
                        <option key={id} value={id}>
                          {p.nome} - {formatCurrency(p.preco)}
                        </option>
                      )
                    })}
              </Select>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <Input
                type="number"
                min="1"
                value={novoItemQuantidade}
                onChange={(e) => setNovoItemQuantidade(e.target.value)}
                placeholder="Qtd"
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
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
