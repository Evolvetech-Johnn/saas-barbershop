import React from 'react';
import { ConfiguracoesTenantForm } from '@/components/configuracoes/ConfiguracoesTenantForm';

export const ConfiguracoesPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">Configurações</h1>
        <p className="text-support-300">
          Gerencie as informações da sua barbearia.
        </p>
      </div>
      
      <div className="bg-base-900 border border-base-800 rounded-lg p-6">
        <ConfiguracoesTenantForm />
      </div>
    </div>
  );
};
