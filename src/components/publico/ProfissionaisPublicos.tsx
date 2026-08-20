import React from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useProfissionais } from '@/hooks/useProfissionais';
import { FadeIn } from './FadeIn';

export const ProfissionaisPublicos: React.FC = () => {
  const { profissionais, loading } = useProfissionais();
  const profissionaisAtivos = profissionais.filter((p) => p.ativo !== false);

  if (!loading && profissionaisAtivos.length === 0) return null;

  return (
    <section id="equipe" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">Nossa Equipe</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça nossos profissionais qualificados.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profissionaisAtivos.map((pro) => {
            const id = (pro as any)._id || pro.id;
            return (
              <FadeIn key={id}>
                <Card className="p-6 text-center bg-card border-border h-full">
                  <Avatar name={pro.nome} size="xl" className="mx-auto mb-4 border-2 border-accent/20" style={{ backgroundColor: pro.cor }} />
                  <h3 className="text-xl font-heading font-semibold mb-1 text-foreground">{pro.nome}</h3>
                  {pro.especialidade && pro.especialidade.length > 0 && (
                    <p className="text-muted-foreground text-sm">{pro.especialidade.join(', ')}</p>
                  )}
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
