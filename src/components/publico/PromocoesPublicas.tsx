import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { usePromocoes } from '@/hooks/usePromocoes';

export const PromocoesPublicas: React.FC = () => {
  const { tenant } = useTenant();
  const { promocoes, isLoading } = usePromocoes(tenant?.id);

  if (!tenant || isLoading) return null;

  if (promocoes.length === 0) return null;

  return (
    <section id="promocoes" aria-labelledby="promocoes-titulo" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="promocoes-titulo" className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Promoções Especiais
          </h2>
          <p className="text-support-300 max-w-2xl mx-auto">
            Aproveite nossas ofertas por tempo limitado.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promocoes.map((promo) => (
            <Card key={(promo as any)._id || promo.id} className="p-6 relative hover:border-[var(--tenant-accent)]/30 transition-colors flex flex-col h-full">
              {promo.destaque && (
                <div className="absolute top-0 right-0 bg-[var(--tenant-accent)] text-base-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
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
                <div className="w-full h-32 bg-base-800 rounded-md mb-4 flex items-center justify-center text-3xl">
                  🎁
                </div>
              )}
              <h3 className="text-xl font-serif font-semibold mb-2">{promo.titulo}</h3>
              <p className="text-support-300 text-sm mb-4 flex-grow">{promo.descricao}</p>
              <div className="pt-4 border-t border-base-800 mt-auto">
                <p className="text-xs text-support-400 mb-4">
                  Válido até {promo.dataFim.toLocaleDateString('pt-BR')}
                </p>
                <Link to={`/${tenant.slug}/agendar`} className="block w-full">
                  <Button className="w-full" variant={promo.destaque ? 'primary' : 'outline'}>
                    Aproveitar Oferta
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
