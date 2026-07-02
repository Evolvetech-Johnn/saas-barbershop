import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export const HeroPublico: React.FC = () => {
  const { tenant } = useTenant();

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              Bem-vindo à <span className="text-[var(--tenant-accent)]">{tenant.nome}</span>
            </h1>
            <p className="text-lg text-support-300 mb-8 leading-relaxed">
              {tenant.descricaoPublica}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={`/${tenant.slug}/agendar`}>
                <Button size="lg">Agendar Horário</Button>
              </Link>
              <Button size="lg" variant="outline">
                Ver Serviços
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[var(--tenant-accent)]/30">
              <img
                src="https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=modern%20barbershop%20interior%20luxury%20black%20and%20gold%20professional%20photography&image_size=square"
                alt={tenant.nome}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
