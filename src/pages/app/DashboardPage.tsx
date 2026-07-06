import React, { useMemo } from 'react'
import { useTenant } from '@/context/TenantContext'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ProximosAgendamentos } from '@/components/dashboard/ProximosAgendamentos'
import { useAgenda } from '@/hooks/useAgenda'
import { useClientes } from '@/hooks/useClientes'
import { mockData } from '@/data/mockData'

export const DashboardPage: React.FC = () => {
  const { tenant } = useTenant()
  const { agendamentos } = useAgenda()
  const { clientes } = useClientes()

  // Filtramos agendamentos de hoje
  const hoje = new Date()
  const agendamentosHoje = useMemo(() => {
    return agendamentos.filter(a => {
      const dataAge = new Date(a.dataHora)
      return dataAge.getDate() === hoje.getDate() && 
             dataAge.getMonth() === hoje.getMonth() &&
             dataAge.getFullYear() === hoje.getFullYear()
    })
  }, [agendamentos, hoje])

  // Faturamento hoje
  const faturamentoHoje = useMemo(() => {
    return agendamentosHoje.reduce((total, a) => {
      if (a.status !== 'cancelado' && a.status !== 'faltou') {
        const servico = mockData.servicos.find(s => s.id === a.servicoId)
        return total + (servico ? servico.preco : 0)
      }
      return total
    }, 0)
  }, [agendamentosHoje])

  // Taxa de comparecimento = (confirmados + concluidos) / total * 100
  const taxaComparecimento = useMemo(() => {
    const total = agendamentosHoje.length
    if (total === 0) return 0
    const presentes = agendamentosHoje.filter(a => a.status === 'concluido' || a.status === 'confirmado').length
    return Math.round((presentes / total) * 100)
  }, [agendamentosHoje])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">
          Olá, {tenant?.nome ?? 'Barbearia'}!
        </h1>
        <p className="text-support-300">Aqui está o resumo do seu dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Agendamentos Hoje"
          value={agendamentosHoje.length.toString()}
          change="Atualizado agora"
          icon="📅"
        />
        <KpiCard
          title="Faturamento Previsto/Hoje"
          value={`R$ ${faturamentoHoje.toFixed(2).replace('.', ',')}`}
          change="Atualizado agora"
          icon="💰"
        />
        <KpiCard
          title="Total de Clientes"
          value={clientes.length.toString()}
          change="Atualizado agora"
          icon="👥"
        />
        <KpiCard
          title="Taxa de Comparecimento"
          value={`${taxaComparecimento}%`}
          change="Baseado nos agendamentos de hoje"
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ProximosAgendamentos agendamentosHoje={agendamentosHoje} />
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
