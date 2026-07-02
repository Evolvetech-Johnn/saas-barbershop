import React from 'react'
import { Card } from '@/components/ui/Card'

interface KpiCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  change?: string
  isPositive?: boolean
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon,
  change,
  isPositive = true,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-support-300 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {change && (
            <p className={`text-xs mt-2 ${
              isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-base-900 flex items-center justify-center text-2xl">
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
