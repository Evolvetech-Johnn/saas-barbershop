import { Comanda, FormaPagamento } from '@/types/comanda';

export const financeiroService = {
  getTotaisByPeriodo: (comandas: Comanda[], dataInicio: Date, dataFim: Date) => {
    const comandasFiltradas = comandas.filter((c) => {
      const d = new Date(c.dataHora);
      return d >= dataInicio && d <= dataFim;
    });

    const total = comandasFiltradas.reduce((sum, c) => sum + c.total, 0);
    // ponytail: toda comanda já registra a forma de pagamento no momento da
    // venda (não existe venda fiado no sistema), então "recebido = total" é
    // correto hoje. Se um dia existir venda a prazo, isso precisa vir de um
    // status de pagamento real por comanda, não dessa suposição.
    const recebido = total;
    const areceber = 0;

    const formasPagamento: Record<FormaPagamento, number> = {
      dinheiro: 0,
      pix: 0,
      cartao_credito: 0,
      cartao_debito: 0,
    };

    comandasFiltradas.forEach((c) => {
      if (formasPagamento[c.formaPagamento] !== undefined) {
        formasPagamento[c.formaPagamento] += c.total;
      }
    });

    return {
      total,
      recebido,
      areceber,
      formasPagamento,
      comandas: comandasFiltradas,
    };
  },
};
