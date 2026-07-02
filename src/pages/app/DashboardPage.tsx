import React from 'react'
import { useTenant } from '@/context/TenantContext'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ProximosAgendamentos } from '@/components/dashboard/ProximosAgendamentos'

export const DashboardPage: React.FC = () => {
  const { tenant } = useTenant()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">
          Olá, {tenant.nome}!
        </h1>
        <p className="text-support-300">Aqui está o resumo do seu dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Agendamentos Hoje"
          value="12"
          change="+3 em relação a ontem"
          icon="📅"
        />
        <KpiCard
          title="Faturamento Hoje"
          value="R$ 1.250,00"
          change="+15% em relação a ontem"
          icon="💰"
        />
        <KpiCard
          title="Clientes Novos"
          value="3"
          change="+1 em relação a ontem"
          icon="👥"
        />
        <KpiCard
          title="Taxa de Comparecimento"
          value="88%"
          change="+5% em relação a ontem"
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProximosAgendamentos />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-base-900 border border-base-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Aniversariantes do Mês</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span>🎂</span>
                <span>João Silva (12/07)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🎂</span>
                <span>Maria Santos (18/07)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🎂</span>
                <span>Pedro Costa (25/07)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
