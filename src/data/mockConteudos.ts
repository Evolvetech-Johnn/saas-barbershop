import { ConteudoPublico } from '../types/conteudoPublico';

export const mockConteudos: ConteudoPublico[] = [
  {
    id: 'cont1',
    tenantId: '1', // classic
    titulo: 'Como cuidar da barba no inverno',
    resumo: 'O clima frio pode ressecar a pele e a barba. Veja 3 dicas essenciais de hidratação.',
    categoria: 'dica',
    dataPublicacao: new Date('2026-06-15T10:00:00'),
    ativo: true,
  },
  {
    id: 'cont2',
    tenantId: '1',
    titulo: 'A história do corte degradê',
    resumo: 'Sabia que o estilo fade começou nos anos 1940 no exército militar? Conheça mais.',
    categoria: 'curiosidade',
    dataPublicacao: new Date('2026-07-01T14:30:00'),
    ativo: true,
  },
  {
    id: 'cont3',
    tenantId: '1',
    titulo: 'Novos produtos na barbearia!',
    resumo: 'Chegou a nova linha premium de pomadas finalizadoras. Venha conferir.',
    categoria: 'novidade',
    dataPublicacao: new Date('2026-07-20T09:00:00'),
    ativo: true,
  }
];
