import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const services = [
  {
    title: 'Corte Clássico',
    price: 'R$ 50,00',
    duration: '30 min',
    description: 'Corte tradicional com acabamento perfeito.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l-7-7m7 7l-2.828 2.828M15.536 8.464L19 5m-7 7l-2.828-2.828M5 19l4.5-4.5" /></svg>
    ),
  },
  {
    title: 'Barba Completa',
    price: 'R$ 40,00',
    duration: '25 min',
    description: 'Aparar e modelar a barba com precisão.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
  {
    title: 'Corte + Barba',
    price: 'R$ 80,00',
    duration: '55 min',
    description: 'Combo completo: corte e barba.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
    ),
  },
  {
    title: 'Tratamento Capilar',
    price: 'R$ 60,00',
    duration: '40 min',
    description: 'Cuidados especiais com o cabelo.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ),
  },
];

export const ServicosPublicos: React.FC = () => {
  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">Nossos Serviços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos serviços de qualidade com profissionais qualificados.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="p-6 bg-card hover:border-accent/30 transition-colors border-border">
              <div className="text-accent mb-4">{service.icon}</div>
              <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold text-accent">{service.price}</p>
                  <p className="text-xs text-muted-foreground">{service.duration}</p>
                </div>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-background border">Agendar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
