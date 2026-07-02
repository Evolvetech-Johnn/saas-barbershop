import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const services = [
  {
    title: 'Corte Clássico',
    price: 'R$ 50,00',
    duration: '30 min',
    description: 'Corte tradicional com acabamento perfeito.',
    icon: '✂️',
  },
  {
    title: 'Barba Completa',
    price: 'R$ 40,00',
    duration: '25 min',
    description: 'Aparar e modelar a barba com precisão.',
    icon: '🧔',
  },
  {
    title: 'Corte + Barba',
    price: 'R$ 80,00',
    duration: '55 min',
    description: 'Combo completo: corte e barba.',
    icon: '💈',
  },
  {
    title: 'Tratamento Capilar',
    price: 'R$ 60,00',
    duration: '40 min',
    description: 'Cuidados especiais com o cabelo.',
    icon: '💆',
  },
];

export const ServicosPublicos: React.FC = () => {
  return (
    <section id="servicos" className="py-20 bg-base-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Nossos Serviços</h2>
          <p className="text-support-300 max-w-2xl mx-auto">
            Oferecemos serviços de qualidade com profissionais qualificados.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="p-6 hover:border-[var(--tenant-accent)]/30 transition-colors">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-serif font-semibold mb-2">{service.title}</h3>
              <p className="text-support-300 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-base-800">
                <div>
                  <p className="text-2xl font-bold text-[var(--tenant-accent)]">{service.price}</p>
                  <p className="text-xs text-support-300">{service.duration}</p>
                </div>
                <Button variant="outline" size="sm">Agendar</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
