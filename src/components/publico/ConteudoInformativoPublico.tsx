import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card } from '@/components/ui/Card';
import { useConteudosPublicos } from '@/hooks/useConteudosPublicos';
import { CategoriaConteudoPublico } from '@/types/conteudoPublico';
import { FadeIn } from './FadeIn';

const categoryLabels: Record<CategoriaConteudoPublico, string> = {
  dica: 'Dica',
  curiosidade: 'Curiosidade',
  novidade: 'Novidade',
};

const categoryColors: Record<CategoriaConteudoPublico, string> = {
  dica: 'bg-foreground/10 text-foreground border-foreground/20',
  curiosidade: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
  novidade: 'bg-accent/10 text-accent border-accent/20',
};

export const ConteudoInformativoPublico: React.FC = () => {
  const { tenant } = useTenant();
  const { conteudos, isLoading } = useConteudosPublicos(tenant?.id);

  if (!tenant || isLoading) return null;

  if (conteudos.length === 0) return null;

  return (
    <section id="conteudo" aria-labelledby="conteudo-titulo" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 id="conteudo-titulo" className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Dicas & Curiosidades
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das novidades e aprenda a cuidar melhor do seu estilo.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conteudos.map((conteudo, index) => (
            <FadeIn key={(conteudo as any)._id || conteudo.id} delay={index * 0.1}>
              <Card className="p-5 bg-card hover:border-accent/30 transition-colors flex flex-col h-full border-border">
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
                    className="text-xs text-muted-foreground"
                  >
                    {conteudo.dataPublicacao.toLocaleDateString('pt-BR')}
                  </time>
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2 line-clamp-2 text-foreground">
                  {conteudo.titulo}
                </h3>
                <p className="text-muted-foreground text-sm flex-grow line-clamp-3">
                  {conteudo.resumo}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
