import React from 'react';
import { StockAlertItem } from '@/types/report';

interface StockAlertProps {
  data: StockAlertItem[];
}

export const StockAlert: React.FC<StockAlertProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <p className="text-base-400 italic text-sm">
        Nenhum produto com estoque baixo.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const ratio = item.quantity / item.minQuantity;
        const isCritical = ratio <= 0.5;
        return (
          <div
            key={item.productId}
            className={`flex items-center justify-between rounded-xl px-4 py-3 border shadow-sm ${
              isCritical
                ? 'bg-red-950 border-red-700 text-red-200'
                : 'bg-yellow-950 border-yellow-700 text-yellow-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{isCritical ? '🚨' : '⚠️'}</span>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs opacity-70">
                  Estoque: {item.quantity} / mínimo: {item.minQuantity}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  isCritical
                    ? 'bg-red-700 text-red-100'
                    : 'bg-yellow-700 text-yellow-100'
                }`}
              >
                {isCritical ? 'CRÍTICO' : 'BAIXO'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
