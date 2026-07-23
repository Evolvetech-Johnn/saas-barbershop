import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { usePlanos } from '@/hooks/usePlanos';
import { useClientes } from '@/hooks/useClientes';
import { PlanoFidelidadeCard } from '@/components/planos/PlanoFidelidadeCard';
import { useToast } from '@/context/ToastContext';
import { Avatar } from '@/components/ui/Avatar';

export const PlanosPage: React.FC = () => {
  const { planos, assinaturas, loading, assinar, cancelar } = usePlanos();
  const { clientes } = useClientes();
  const { addToast } = useToast();
  
  const [assinandoPlano, setAssinandoPlano] = useState<string | null>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tenant-accent)]"></div>
      </div>
    );
  }

  const handleAssinar = async (planoId: string) => {
    if (!clienteSelecionado) {
      addToast('Selecione um cliente primeiro!', 'warning');
      return;
    }
    const success = await assinar(clienteSelecionado, planoId);
    if (success) {
      setAssinandoPlano(null);
      setClienteSelecionado('');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Planos Disponíveis */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Planos e Recorrência (SaaS)</h1>
            <p className="text-support-300">
              Ofereça pacotes mensais e fidelize seus clientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {planos.map((plano) => (
            <div key={plano.id} className="relative">
              <PlanoFidelidadeCard plano={plano} />
              
              {assinandoPlano === plano.id ? (
                <div className="absolute inset-0 bg-base-900/95 backdrop-blur-sm p-4 rounded-xl border border-[var(--tenant-accent)] flex flex-col justify-center animate-fade-in z-10">
                  <h4 className="font-medium text-sm mb-4">Selecione o Cliente para assinar:</h4>
                  <select 
                    className="w-full bg-base-800 border-none rounded-md px-3 py-2 text-sm text-base-100 mb-4 focus:ring-1 focus:ring-[var(--tenant-accent)]"
                    value={clienteSelecionado}
                    onChange={(e) => setClienteSelecionado(e.target.value)}
                  >
                    <option value="">-- Escolher Cliente --</option>
                    {clientes.map(c => (
                      <option key={(c as any)._id || c.id} value={(c as any)._id || c.id}>{c.nome}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => handleAssinar(plano.id)}>Confirmar</Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => setAssinandoPlano(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <Button variant="primary" className="w-full shadow-lg" onClick={() => setAssinandoPlano(plano.id)}>
                    Assinar Cliente
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {planos.length === 0 && (
          <div className="text-center py-12 bg-base-900 rounded-xl border border-base-800">
            <p className="text-support-300">Nenhum plano cadastrado ainda.</p>
          </div>
        )}
      </section>

      {/* Assinaturas Ativas */}
      <section className="bg-base-900 p-6 rounded-xl border border-base-800 shadow-xl">
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
          Assinaturas Ativas
          <span className="text-sm px-3 py-1 bg-brand-primary/20 text-[var(--tenant-accent)] rounded-full font-sans">
            {assinaturas.length}
          </span>
        </h2>

        {assinaturas.length === 0 ? (
          <p className="text-support-400 italic">Nenhuma assinatura ativa no momento.</p>
        ) : (
          <div className="space-y-4">
            {assinaturas.map((ass) => {
              const clienteNome = ass.clienteId?.nome || 'Cliente Removido';
              const planoNome = ass.planoFidelidadeId?.nome || 'Plano Removido';
              
              return (
                <div key={ass.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-base-800/50 rounded-lg border border-base-700/50 hover:border-base-600 transition-colors">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <Avatar name={clienteNome} />
                    <div>
                      <h4 className="font-medium text-base-100">{clienteNome}</h4>
                      <p className="text-sm text-support-300">{planoNome} • Desde {new Date(ass.dataInicio).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => {
                      if (window.confirm('Cancelar assinatura deste cliente?')) {
                        cancelar(ass.id);
                      }
                    }}>
                      Cancelar Assinatura
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
