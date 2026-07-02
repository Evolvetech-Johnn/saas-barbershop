import React from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

const professionals = [
  {
    name: 'João Silva',
    role: 'Barbeiro Chefe',
    specialty: 'Cortes clássicos',
    image: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20portrait%20man%20smiling%20realistic&image_size=square',
  },
  {
    name: 'Maria Santos',
    role: 'Barbeira',
    specialty: 'Barbas modernas',
    image: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20female%20barber%20portrait%20woman%20smiling%20realistic&image_size=square',
  },
  {
    name: 'Carlos Pereira',
    role: 'Barbeiro',
    specialty: 'Cortes modernos',
    image: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=professional%20barber%20portrait%20man%20smiling%20realistic&image_size=square',
  },
];

export const ProfissionaisPublicos: React.FC = () => {
  return (
    <section id="equipe" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Nossa Equipe</h2>
          <p className="text-support-300 max-w-2xl mx-auto">
            Conheça nossos profissionais qualificados.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {professionals.map((pro, index) => (
            <Card key={index} className="p-6 text-center">
              <Avatar src={pro.image} name={pro.name} size="xl" className="mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold mb-1">{pro.name}</h3>
              <p className="text-[var(--tenant-accent)] mb-2">{pro.role}</p>
              <p className="text-support-300 text-sm">{pro.specialty}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
