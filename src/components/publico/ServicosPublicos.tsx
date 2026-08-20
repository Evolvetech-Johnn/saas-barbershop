import React from 'react';
import { Scissors } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useTenant } from '@/context/TenantContext';
import { useServicos } from '@/hooks/useServicos';
import { FadeIn } from './FadeIn';

export const ServicosPublicos: React.FC = () => {
  const { tenant } = useTenant();
  const { servicos, loading } = useServicos();
  const servicosAtivos = servicos.filter((s) => s.ativo !== false);

  if (!loading && servicosAtivos.length === 0) return null;

  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">Nossos Serviços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos serviços de qualidade com profissionais qualificados.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicosAtivos.map((servico) => {
            const id = (servico as any)._id || servico.id;
            return (
              <FadeIn key={id}>
                <Card className="p-6 bg-card hover:border-accent/30 transition-colors border-border h-full flex flex-col">
                  <div className="text-accent mb-4">
                    <Scissors className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">{servico.nome}</h3>
                  <div className="flex-grow" />
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.preco)}
                      </p>
                      <p className="text-xs text-muted-foreground">{servico.duracaoMinutos} min</p>
                    </div>
                    <Link to={tenant ? `/${tenant.slug}/agendar` : '#'}>
                      <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-background border">
                        Agendar
                      </Button>
                    </Link>
                  </div>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
