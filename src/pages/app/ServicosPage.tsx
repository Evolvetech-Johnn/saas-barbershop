import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scissors, Trash2, Edit3, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useServicos } from '@/hooks/useServicos';
import { ServicoForm } from '@/components/servicos/ServicoForm';
import { Servico } from '@/types/servico';

export const ServicosPage: React.FC = () => {
  const { servicos, loading, criarServico, atualizarServico, excluirServico } = useServicos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servicoEditando, setServicoEditando] = useState<Servico | null>(null);

  const handleNew = () => {
    setServicoEditando(null);
    setIsModalOpen(true);
  };

  const handleEdit = (s: Servico) => {
    setServicoEditando(s);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Servico>) => {
    if (servicoEditando) {
      return atualizarServico((servicoEditando as any)._id || servicoEditando.id, data);
    } else {
      return criarServico(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este serviço?')) {
      excluirServico(id);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-base-100">Serviços</h1>
          <p className="text-support-300 mt-1">Defina o que você oferece, preços e comissões da equipe.</p>
        </div>
        <Button onClick={handleNew} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Novo Serviço</span>
        </Button>
      </header>

      {loading && servicos.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-base-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((s, index) => (
            <motion.div
              key={(s as any)._id || s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-base-900 border border-base-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-base-700 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-800 flex items-center justify-center text-support-400">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-100">{s.nome}</h3>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(s)}
                    className="p-1.5 text-support-300 hover:text-base-100 hover:bg-base-800 rounded-md transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete((s as any)._id || s.id)}
                    className="p-1.5 text-support-300 hover:text-red-400 hover:bg-base-800 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-base-800/50 text-sm">
                <div className="flex items-center gap-1.5 text-support-200 font-medium">
                  <DollarSign size={16} className="text-green-500" />
                  R$ {s.preco.toFixed(2).replace('.', ',')}
                </div>
                <div className="flex items-center gap-1.5 text-support-300">
                  <Clock size={16} />
                  {s.duracaoMinutos} min
                </div>
                {s.comissaoPercentual !== undefined && s.comissaoPercentual !== null && (
                  <div className="flex items-center gap-1.5 text-support-300 ml-auto bg-base-800 px-2 py-1 rounded-md text-xs">
                    Comissão: {s.comissaoPercentual}%
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {servicos.length === 0 && (
            <div className="col-span-full py-16 text-center bg-base-900 border border-base-800 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-base-800 rounded-full flex items-center justify-center text-support-400 mb-4">
                <Scissors size={24} />
              </div>
              <h3 className="text-lg font-medium text-base-100">Nenhum serviço cadastrado</h3>
              <p className="text-support-300 mt-2 mb-6 max-w-sm mx-auto">
                Adicione cortes, barboterapia e outros serviços que sua barbearia oferece.
              </p>
              <Button onClick={handleNew}>Adicionar Primeiro Serviço</Button>
            </div>
          )}
        </div>
      )}

      <ServicoForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        servico={servicoEditando}
      />
    </div>
  );
};
