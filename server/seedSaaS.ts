import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const combos = [
  { nome: 'Essencial', preco: 45, duracaoMinutos: 30 },
  { nome: 'Corte completo', preco: 55, duracaoMinutos: 40 },
  { nome: 'Corte e barba', preco: 70, duracaoMinutos: 50 },
  { nome: 'Clássico', preco: 85, duracaoMinutos: 60 },
  { nome: 'Premium', preco: 95, duracaoMinutos: 70 },
  { nome: 'Black', preco: 125, duracaoMinutos: 90 },
  { nome: 'Dia de cuidado', preco: 145, duracaoMinutos: 120 },
  { nome: 'Pai e filho', preco: 70, duracaoMinutos: 60 },
  { nome: 'Noivo essencial', preco: 140, duracaoMinutos: 90 },
  { nome: 'Dia do noivo completo', preco: 300, duracaoMinutos: 180 },
];

const planos = [
  { nome: 'Corte mensal', descricao: 'Até 4 cortes', precoMensal: 130, beneficios: ['Até 4 cortes'] },
  { nome: 'Barba mensal', descricao: 'Até 4 atendimentos de barba', precoMensal: 110, beneficios: ['Até 4 atendimentos de barba'] },
  { nome: 'Corte e barba', descricao: 'Até 4 cortes e 4 barbas', precoMensal: 220, beneficios: ['Até 4 cortes', 'Até 4 barbas'] },
  { nome: 'Plano executivo', descricao: '4 cortes, 4 barbas e 2 sobrancelhas', precoMensal: 240, beneficios: ['4 cortes', '4 barbas', '2 sobrancelhas'] },
  { nome: 'Plano ilimitado', descricao: 'Corte e barba conforme regras da casa', precoMensal: 250, beneficios: ['Cortes e barbas ilimitadas (regras da casa)'] },
];

async function seed() {
  const { supabase } = await import('./src/lib/supabase');
  const { data: tenant, error: tenantErr } = await supabase.from('tenants').select('id,nome').limit(1).maybeSingle();
  if (tenantErr) throw tenantErr;
  if (!tenant) {
    console.error('Nenhum Tenant encontrado! Rode server/src/scripts/seed.ts primeiro.');
    process.exit(1);
  }
  console.log(`Usando Tenant: ${tenant.nome} (${tenant.id})`);

  for (const combo of combos) {
    const { data: exists } = await supabase.from('servicos').select('id').eq('tenant_id', tenant.id).eq('nome', combo.nome).maybeSingle();
    if (!exists) {
      await supabase.from('servicos').insert({ tenant_id: tenant.id, nome: combo.nome, preco: combo.preco, duracao_minutos: combo.duracaoMinutos, ativo: true });
      console.log(`[+] Combo criado: ${combo.nome}`);
    } else {
      console.log(`[-] Combo já existe: ${combo.nome}`);
    }
  }

  for (const plano of planos) {
    const { data: exists } = await supabase.from('planos_fidelidade').select('id').eq('tenant_id', tenant.id).eq('nome', plano.nome).maybeSingle();
    if (!exists) {
      await supabase
        .from('planos_fidelidade')
        .insert({ tenant_id: tenant.id, nome: plano.nome, descricao: plano.descricao, preco_mensal: plano.precoMensal, beneficios: plano.beneficios, ativo: true });
      console.log(`[+] Plano criado: ${plano.nome}`);
    } else {
      console.log(`[-] Plano já existe: ${plano.nome}`);
    }
  }

  console.log('✅ Seeding concluído!');
}

seed().catch(console.error);
