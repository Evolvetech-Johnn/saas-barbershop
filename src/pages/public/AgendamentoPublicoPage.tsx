import React from 'react'
import { AgendamentoPublicoForm } from '@/components/publico/AgendamentoPublicoForm'

export const AgendamentoPublicoPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Agende seu horário
          </h1>
          <p className="text-support-300 max-w-2xl mx-auto">
            Escolha o serviço, profissional, data e horário que melhor combina com você.
          </p>
        </div>
        <AgendamentoPublicoForm />
      </div>
    </div>
  )
}
