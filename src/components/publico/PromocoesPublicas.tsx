import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { usePromocoes } from '@/hooks/usePromocoes';
import { FadeIn } from './FadeIn';

export const PromocoesPublicas: React.FC = () => {
  const { tenant } = useTenant();
  const { promocoes, isLoading } = usePromocoes(tenant?.id);

  if (!tenant || isLoading) return null;

  if (promocoes.length === 0) return null;

  return (
    <section id="promocoes" aria-labelledby="promocoes-titulo" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 id="promocoes-titulo" className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
            Promoções Especiais
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aproveite nossas ofertas por tempo limitado.
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promocoes.map((promo, index) => (
            <FadeIn key={(promo as any)._id || promo.id} delay={index * 0.1}>
              <Card className="p-6 relative bg-card hover:border-accent/30 transition-colors flex flex-col h-full border-border">
                {promo.destaque && (
                  <div className="absolute top-0 right-0 bg-accent text-background text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Destaque
                  </div>
                )}
                {promo.imagemUrl && (
                  <img
                    src={promo.imagemUrl}
                    alt=""
                    loading="lazy"
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                {!promo.imagemUrl && (
                  <div className="w-full h-32 bg-background border border-border/50 rounded-md mb-4 flex items-center justify-center text-accent">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                  </div>
                )}
                <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">{promo.titulo}</h3>
                <p className="text-muted-foreground text-sm mb-4 flex-grow">{promo.descricao}</p>
                <div className="pt-4 border-t border-border mt-auto">
                  <p className="text-xs text-muted-foreground/80 mb-4">
                    Válido até {promo.dataFim.toLocaleDateString('pt-BR')}
                  </p>
                  <Link to={`/${tenant.slug}/agendar`} className="block w-full">
                    <Button className={`w-full ${promo.destaque ? 'bg-accent text-background hover:bg-accent/90' : 'border-border text-foreground hover:bg-accent hover:text-background border'}`} variant={promo.destaque ? 'primary' : 'outline'}>
                      Aproveitar Oferta
                    </Button>
                  </Link>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
