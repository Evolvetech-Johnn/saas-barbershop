import React from 'react';
import { HeroPublico } from '@/components/publico/HeroPublico';
import { ServicosPublicos } from '@/components/publico/ServicosPublicos';
import { ProfissionaisPublicos } from '@/components/publico/ProfissionaisPublicos';

export const PaginaPublicaPage: React.FC = () => {
  return (
    <>
      <HeroPublico />
      <ServicosPublicos />
      <ProfissionaisPublicos />
      <section id="contato" className="py-20 bg-base-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Entre em Contato</h2>
            <p className="text-support-300 max-w-2xl mx-auto">
              Estamos aqui para atendê-lo.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--tenant-accent)]/20 flex items-center justify-center text-[var(--tenant-accent)]">
                    📍
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Endereço</h4>
                    <p className="text-support-300">Rua das Flores, 123 - Centro</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--tenant-accent)]/20 flex items-center justify-center text-[var(--tenant-accent)]">
                    📞
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Telefone</h4>
                    <p className="text-support-300">(11) 98765-4321</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--tenant-accent)]/20 flex items-center justify-center text-[var(--tenant-accent)]">
                    ⏰
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Horário</h4>
                    <p className="text-support-300">Seg-Sex: 9h-19h | Sáb: 9h-17h</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden border border-base-800">
              <div className="w-full h-full bg-base-800 flex items-center justify-center text-support-300">
                🗺️ Mapa aqui
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
