import { Promocao } from '../types/promocao';

export const mockPromocoes: Promocao[] = [
  {
    id: 'promo1',
    tenantId: '1', // tenant 'classic' do mockData.ts
    titulo: 'Desconto de Primavera',
    descricao: 'Aproveite 20% de desconto no combo Corte + Barba todas as terças e quartas.',
    destaque: true,
    dataInicio: new Date('2026-09-01T00:00:00'),
    dataFim: new Date('2026-11-30T23:59:59'), // data no futuro para aparecer ativo
    ativo: true,
  },
  {
    id: 'promo2',
    tenantId: '1',
    titulo: 'Indique um Amigo',
    descricao: 'Ganhe um Spa de Barba grátis ao trazer um amigo para o primeiro corte.',
    destaque: false,
    dataInicio: new Date('2026-01-01T00:00:00'),
    dataFim: new Date('2026-12-31T23:59:59'),
    ativo: true,
  },
  {
    id: 'promo3',
    tenantId: '2', // urban
    titulo: 'Estilo Urbano',
    descricao: 'Cortes degradê com 10% off.',
    destaque: true,
    dataInicio: new Date('2026-01-01T00:00:00'),
    dataFim: new Date('2026-12-31T23:59:59'),
    ativo: true,
  }
];
