import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card } from '@/components/ui/Card';
import { useConteudosPublicos } from '@/hooks/useConteudosPublicos';
import { CategoriaConteudoPublico } from '@/types/conteudoPublico';

const categoryLabels: Record<CategoriaConteudoPublico, string> = {
  dica: 'Dica',
  curiosidade: 'Curiosidade',
  novidade: 'Novidade',
};

const categoryColors: Record<CategoriaConteudoPublico, string> = {
  dica: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  curiosidade: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  novidade: 'bg-[var(--tenant-accent)]/10 text-[var(--tenant-accent)] border-[var(--tenant-accent)]/20',
};

export const ConteudoInformativoPublico: React.FC = () => {
  const { tenant } = useTenant();
  const { conteudos, isLoading } = useConteudosPublicos(tenant?.id);

  if (!tenant || isLoading) return null;

  if (conteudos.length === 0) return null;

  return (
    <section id="conteudo" aria-labelledby="conteudo-titulo" className="py-20 bg-base-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="conteudo-titulo" className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Dicas & Curiosidades
          </h2>
          <p className="text-support-300 max-w-2xl mx-auto">
            Fique por dentro das novidades e aprenda a cuidar melhor do seu estilo.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conteudos.map((conteudo) => (
            <Card key={(conteudo as any)._id || conteudo.id} className="p-5 hover:border-[var(--tenant-accent)]/30 transition-colors flex flex-col h-full">
              {conteudo.imagemUrl && (
                <img
                  src={conteudo.imagemUrl}
                  alt=""
                  loading="lazy"
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs px-2 py-1 rounded-md border ${
                    categoryColors[conteudo.categoria]
                  }`}
                >
                  {categoryLabels[conteudo.categoria]}
                </span>
                <time
                  dateTime={conteudo.dataPublicacao.toISOString()}
                  className="text-xs text-support-400"
                >
                  {conteudo.dataPublicacao.toLocaleDateString('pt-BR')}
                </time>
              </div>
              <h3 className="text-lg font-serif font-semibold mb-2 line-clamp-2">
                {conteudo.titulo}
              </h3>
              <p className="text-support-300 text-sm flex-grow line-clamp-3">
                {conteudo.resumo}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
