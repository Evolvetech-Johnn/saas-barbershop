import React from 'react';
import { HeroPublico } from '@/components/publico/HeroPublico';
import { ServicosPublicos } from '@/components/publico/ServicosPublicos';
import { ProfissionaisPublicos } from '@/components/publico/ProfissionaisPublicos';
import { PromocoesPublicas } from '@/components/publico/PromocoesPublicas';
import { ConteudoInformativoPublico } from '@/components/publico/ConteudoInformativoPublico';
import { useTenant } from '@/context/TenantContext';
import { usePublicSeo } from '@/hooks/usePublicSeo';
import { useLocalBusinessSchema } from '@/hooks/useLocalBusinessSchema';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/publico/FadeIn';

export const PaginaPublicaPage: React.FC = () => {
  const { tenant } = useTenant();

  usePublicSeo({
    title: tenant ? `${tenant.nome} | Barbearia` : 'Barbearia',
    description: tenant?.descricaoPublica || 'Barbearia',
    logoUrl: tenant?.logoUrl,
  });

  useLocalBusinessSchema(tenant);

  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <HeroPublico />
      <ServicosPublicos />
      <PromocoesPublicas />
      <ConteudoInformativoPublico />
      <ProfissionaisPublicos />
      
      <section id="contato" className="py-20 bg-background border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Entre em Contato</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para atendê-lo.
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Endereço</h4>
                    <p className="text-muted-foreground">Rua das Flores, 123 - Centro</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Telefone</h4>
                    <p className="text-muted-foreground">(11) 98765-4321</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Horário</h4>
                    <p className="text-muted-foreground">Seg-Sex: 9h-19h | Sáb: 9h-17h</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2} className="aspect-video rounded-lg overflow-hidden border border-border">
              <div className="w-full h-full bg-card flex items-center justify-center text-muted-foreground">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn delay={0.3} className="mt-16 text-center border-t border-border pt-12">
            <h3 className="text-2xl font-heading font-bold mb-6">Pronto para o seu novo visual?</h3>
            <Link to={tenant ? `/${tenant.slug}/agendar` : '#'}>
              <Button size="lg" className="bg-accent text-background hover:bg-accent/90">
                Agendar Agora
              </Button>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
