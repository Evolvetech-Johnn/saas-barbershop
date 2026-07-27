import { Agendamento } from '../models';
import { supabase } from '../lib/supabase';

export class SmartMarketingService {
  /**
   * Analisa agendamentos dos últimos 30 dias para identificar períodos ociosos
   * e gera sugestões de promoções para o próximo mês.
   */
  static async analisarEGerarSugestoes(tenantId: string) {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    // 1. Buscar agendamentos dos últimos 30 dias
    const agendamentos = await Agendamento.find({
      tenantId,
      dataHora: { $gte: trintaDiasAtras, $lte: hoje },
      status: { $in: ['concluido', 'confirmado'] } // apenas os que realmente aconteceram/vão acontecer
    });

    // 2. Agrupar por dia da semana (0-6) e turno (Manhã, Tarde, Noite)
    // 0 = Domingo, 1 = Segunda, etc.
    const ocupacao = new Map<string, number>();
    
    // Inicializar o mapa (seg a sáb) - assumindo que domingo é fechado, se não, pode incluir
    const turnos = ['Manhã', 'Tarde', 'Noite'];
    for (let i = 1; i <= 6; i++) {
      turnos.forEach(t => ocupacao.set(`${i}-${t}`, 0));
    }

    agendamentos.forEach(ag => {
      const d = new Date(ag.dataHora);
      const diaSemana = d.getDay(); // 0-6
      const hora = d.getHours();
      let turno = 'Noite';
      if (hora >= 8 && hora < 12) turno = 'Manhã';
      else if (hora >= 12 && hora < 18) turno = 'Tarde';
      
      const key = `${diaSemana}-${turno}`;
      if (ocupacao.has(key)) {
        ocupacao.set(key, ocupacao.get(key)! + 1);
      }
    });

    // 3. Encontrar os períodos mais ociosos (menor número de agendamentos)
    // Ordenar pelas chaves com menor ocupação
    const ociosos = Array.from(ocupacao.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3); // Pegar os 3 períodos mais vazios

    const nomesDias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const sugestoesGeradas = [];

    // Próximo mês para a promoção
    const proximoMesInicio = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const proximoMesFim = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0, 23, 59, 59);

    for (const [key, count] of ociosos) {
      // count muito baixo significa ociosidade alta.
      // Podemos gerar uma sugestão!
      const [diaStr, turno] = key.split('-');
      const dia = parseInt(diaStr);
      const diaNome = nomesDias[dia];

      // Verificar se já existe uma sugestão parecida pendente para evitar duplicação
      const titulo = `Especial ${diaNome} à ${turno}`;
      
      const { data: existentes } = await supabase
        .from('promocoes')
        .select('id')
        .eq('tenant_id', tenantId)
        .eq('titulo', titulo)
        .eq('is_sugestao', true);

      if (!existentes || existentes.length === 0) {
        // Criar sugestão
        const { data, error } = await supabase
          .from('promocoes')
          .insert({
            tenant_id: tenantId,
            titulo: titulo,
            descricao: `Nossa análise inteligente notou que você costuma ter horários livres na ${diaNome} à ${turno}. Que tal oferecer um desconto para atrair mais clientes neste horário?`,
            destaque: false,
            data_inicio: proximoMesInicio.toISOString(),
            data_fim: proximoMesFim.toISOString(),
            ativo: false, // Inativo até que o admin aprove
            is_sugestao: true,
            desconto_sugerido: 15 // 15% como base
          })
          .select();

        if (!error && data) {
          sugestoesGeradas.push(data[0]);
        } else {
          console.error("Erro ao inserir sugestão:", error);
        }
      }
    }

    return sugestoesGeradas;
  }
}
