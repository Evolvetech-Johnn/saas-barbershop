import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { FadeIn } from '@/components/publico/FadeIn';

export const GaleriaPublica: React.FC = () => {
  const { tenant } = useTenant();
  const imagens = tenant?.imagensGaleria?.filter(Boolean) || [];

  if (imagens.length === 0) return null;

  return (
    <section id="galeria" className="py-20 bg-background border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Nosso Espaço</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Um pouco do nosso ambiente e trabalho.</p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((url, i) => (
            <FadeIn key={i} delay={i * 0.05} className="aspect-square rounded-lg overflow-hidden border border-border bg-card">
              <img src={url} alt={`Foto ${i + 1} da barbearia`} className="w-full h-full object-cover" loading="lazy" />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
