import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Scissors, Trash2, Edit3, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useProfissionais } from '@/hooks/useProfissionais';
import { useComissoes } from '@/hooks/useComissoes';
import { ProfissionalForm } from '@/components/equipe/ProfissionalForm';
import { Profissional } from '@/types/profissional';
import { formatCurrency } from '@/utils/formatters';

export const EquipePage: React.FC = () => {
  const { profissionais, loading, criarProfissional, atualizarProfissional, excluirProfissional } = useProfissionais();
  const { resumo } = useComissoes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profissionalEditando, setProfissionalEditando] = useState<Profissional | null>(null);

  const handleNew = () => {
    setProfissionalEditando(null);
    setIsModalOpen(true);
  };

  const handleEdit = (p: Profissional) => {
    setProfissionalEditando(p);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Profissional>) => {
    if (profissionalEditando) {
      return atualizarProfissional((profissionalEditando as any)._id || profissionalEditando.id, data);
    } else {
      return criarProfissional(data);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este profissional?')) {
      excluirProfissional(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-base-100">Equipe</h1>
          <p className="text-support-300 mt-1">Gerencie os barbeiros e comissões da sua barbearia.</p>
        </div>
        <Button onClick={handleNew} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Novo Profissional</span>
        </Button>
      </header>

      {loading && profissionais.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-base-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profissionais.map((p, index) => {
            const pId = (p as any)._id || p.id;
            const stats = resumo.find(r => r.profissionalId === pId);
            const totalComissao = stats?.totalComissao || 0;

            return (
            <motion.div
              key={pId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-base-900 border border-base-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-base-700 transition-all group relative overflow-hidden flex flex-col"
            >
              <div 
                className="absolute top-0 left-0 w-full h-1 opacity-80"
                style={{ backgroundColor: p.cor || '#10b981' }}
              />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-base-800 text-base-100 font-serif text-xl border-2"
                    style={{ borderColor: p.cor || '#10b981' }}
                  >
                    {p.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-base-100 leading-tight">{p.nome}</h3>
                    <div className="flex items-center gap-1 text-xs text-support-300 mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Ativo</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(p)}
                    className="p-1.5 text-support-300 hover:text-base-100 hover:bg-base-800 rounded-md transition-colors"
                    aria-label="Editar"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(pId)}
                    className="p-1.5 text-support-300 hover:text-red-400 hover:bg-base-800 rounded-md transition-colors"
                    aria-label="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mt-2 flex-grow">
                <div>
                  <span className="text-xs font-medium text-support-400 uppercase tracking-wider">Especialidades</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.especialidade && p.especialidade.length > 0 ? (
                      p.especialidade.map((esp, i) => (
                        <span key={i} className="px-2 py-1 bg-base-800 text-support-200 text-xs rounded-md border border-base-700 flex items-center gap-1">
                          <Scissors size={10} />
                          {esp}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-support-400 italic">Nenhuma</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-base-800/50 flex justify-between items-center bg-base-800/20 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <div className="flex items-center gap-2 text-support-200">
                  <DollarSign size={16} className="text-[var(--tenant-accent)]" />
                  <span className="text-sm font-medium">Comissões (Mês)</span>
                </div>
                <div className="font-bold text-[var(--tenant-accent)] text-lg">
                  {formatCurrency(totalComissao)}
                </div>
              </div>
            </motion.div>
          )})}

          {profissionais.length === 0 && (
            <div className="col-span-full py-16 text-center bg-base-900 border border-base-800 rounded-2xl flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-base-800 rounded-full flex items-center justify-center text-support-400 mb-4">
                <Scissors size={24} />
              </div>
              <h3 className="text-lg font-medium text-base-100">Nenhum profissional cadastrado</h3>
              <p className="text-support-300 mt-2 mb-6 max-w-sm mx-auto">
                Adicione barbeiros e outros profissionais para que eles apareçam na agenda.
              </p>
              <Button onClick={handleNew}>Adicionar Primeiro Profissional</Button>
            </div>
          )}
        </div>
      )}

      <ProfissionalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        profissional={profissionalEditando}
      />
    </div>
  );
};
