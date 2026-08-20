import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import bcrypt from 'bcrypt';

async function seedDatabase() {
  // import dinâmico: garante que dotenv já rodou antes do client Supabase
  // ler as env vars (import estático seria hoisted pra antes do dotenv.config acima).
  const { supabase } = await import('../lib/supabase');

  console.log('🚀 Iniciando seed do banco de dados...\n');

  if (process.env.NODE_ENV !== 'production') {
    console.log('🗑️ Limpando dados existentes (apenas dev)...\n');
    // Ordem importa: tabela filha (com a FK) sempre antes da tabela pai referenciada.
    for (const table of [
      'comanda_itens',
      'comissoes',
      'comandas',
      'agendamentos',
      'assinaturas_fidelidade',
      'clientes',
      'planos_fidelidade',
      'produtos',
      'servicos',
      'profissionais',
      'usuarios',
      'promocoes',
      'conteudos_publicos',
      'faturas',
      'assinaturas',
      'tenants',
    ]) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw new Error(`Falha ao limpar "${table}": ${error.message}`);
    }
  }

  console.log('1️⃣ Criando Tenant Admin...');
  const { data: tenantAdmin, error: tenantAdminErr } = await supabase
    .from('tenants')
    .insert({
      slug: 'plataforma-admin',
      nome: 'Painel SaaS Admin',
      cor_acento: '#10b981',
      plano_saas: 'premium',
      status: 'ativo',
      data_vencimento_plano: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single();
  if (tenantAdminErr) throw tenantAdminErr;
  console.log(`✅ Tenant Admin criado (${tenantAdmin.id})\n`);

  console.log('2️⃣ Criando Usuário Admin Master...');
  const senhaHash = await bcrypt.hash('admin123', 12);
  const { data: usuarioAdmin, error: usuarioAdminErr } = await supabase
    .from('usuarios')
    .insert({
      tenant_id: tenantAdmin.id,
      email: 'admin@barbearia-saas.com',
      senha_hash: senhaHash,
      nome: 'Administrador',
      papel: 'admin',
      ativo: true,
    })
    .select()
    .single();
  if (usuarioAdminErr) throw usuarioAdminErr;
  console.log(`✅ Usuário Admin criado (${usuarioAdmin.id})`);
  console.log(`   Email: ${usuarioAdmin.email}`);
  console.log(`   Senha temporária: admin123\n`);

  console.log('3️⃣ Criando Tenant Demo (Barbearia Classic)...');
  const { data: tenantDemo, error: tenantDemoErr } = await supabase
    .from('tenants')
    .insert({
      slug: 'classic',
      nome: 'Barbearia Classic',
      cor_acento: '#d4af37',
      plano_saas: 'premium',
      status: 'ativo',
      data_vencimento_plano: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      descricao_publica: 'Barbearia tradicional com estilo clássico, oferecendo cortes precisos e atendimento personalizado.',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo',
      telefone: '(11) 98765-4321',
      horario_funcionamento: 'Seg-Sex: 9h-19h | Sáb: 9h-17h',
      onboarding_concluido: true,
    })
    .select()
    .single();
  if (tenantDemoErr) throw tenantDemoErr;
  console.log(`✅ Tenant Demo criado (${tenantDemo.id})\n`);

  console.log('4️⃣ Criando Profissionais Demo...');
  const { data: profissionais, error: profissionaisErr } = await supabase
    .from('profissionais')
    .insert([
      { tenant_id: tenantDemo.id, nome: 'Carlos', especialidade: ['Corte', 'Barba'], cor: '#d4af37', ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Ana', especialidade: ['Corte', 'Coloração'], cor: '#f59e0b', ativo: true },
    ])
    .select();
  if (profissionaisErr) throw profissionaisErr;
  console.log(`   ✅ ${profissionais.length} profissionais criados\n`);

  console.log('5️⃣ Criando Serviços Demo...');
  const { data: servicos, error: servicosErr } = await supabase
    .from('servicos')
    .insert([
      { tenant_id: tenantDemo.id, nome: 'Corte de Cabelo', preco: 50, duracao_minutos: 30, comissao_percentual: 30, ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Barba', preco: 35, duracao_minutos: 25, comissao_percentual: 30, ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Corte + Barba', preco: 75, duracao_minutos: 55, comissao_percentual: 30, ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Spa da Barba', preco: 60, duracao_minutos: 40, comissao_percentual: 35, ativo: true },
    ])
    .select();
  if (servicosErr) throw servicosErr;
  console.log(`   ✅ ${servicos.length} serviços criados\n`);

  console.log('6️⃣ Criando Clientes Demo...');
  const { data: clientes, error: clientesErr } = await supabase
    .from('clientes')
    .insert([
      { tenant_id: tenantDemo.id, nome: 'João Silva', telefone: '(11) 98765-4321', email: 'joao@email.com', ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Maria Santos', telefone: '(11) 91234-5678', email: 'maria@email.com', ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Pedro Costa', telefone: '(11) 99876-5432', ativo: true },
    ])
    .select();
  if (clientesErr) throw clientesErr;
  console.log(`   ✅ ${clientes.length} clientes criados\n`);

  console.log('7️⃣ Criando Produtos Demo...');
  const { data: produtos, error: produtosErr } = await supabase
    .from('produtos')
    .insert([
      { tenant_id: tenantDemo.id, nome: 'Pomada Classic', categoria: 'Cabelo', preco: 45, custo: 20, quantidade: 15, quantidade_minima: 5, ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Óleo de Barba', categoria: 'Barba', preco: 35, custo: 15, quantidade: 20, quantidade_minima: 8, ativo: true },
      { tenant_id: tenantDemo.id, nome: 'Shampoo Premium', categoria: 'Cabelo', preco: 55, custo: 25, quantidade: 10, quantidade_minima: 5, ativo: true },
    ])
    .select();
  if (produtosErr) throw produtosErr;
  console.log(`   ✅ ${produtos.length} produtos criados\n`);

  console.log('8️⃣ Criando Planos de Fidelidade Demo...');
  const { data: planosFidelidade, error: planosErr } = await supabase
    .from('planos_fidelidade')
    .insert([
      {
        tenant_id: tenantDemo.id,
        nome: 'Plano Classic',
        descricao: 'Ideal para clientes frequentes',
        preco_mensal: 49.9,
        beneficios: ['10% de desconto em todos os serviços', 'Corte mensal grátis', 'Prioridade no agendamento'],
        ativo: true,
      },
      {
        tenant_id: tenantDemo.id,
        nome: 'Plano Premium',
        descricao: 'Para quem quer o melhor',
        preco_mensal: 99.9,
        beneficios: ['20% de desconto em todos os serviços', 'Corte + Barba mensais grátis', 'Prioridade no agendamento', '1 produto grátis por mês'],
        ativo: true,
      },
    ])
    .select();
  if (planosErr) throw planosErr;
  console.log(`   ✅ ${planosFidelidade.length} planos criados\n`);

  console.log('9️⃣ Criando Assinaturas Demo...');
  let assinaturasCount = 0;
  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    const plano = planosFidelidade[i % planosFidelidade.length];
    const { error: assErr } = await supabase
      .from('assinaturas_fidelidade')
      .insert({ tenant_id: tenantDemo.id, cliente_id: cliente.id, plano_fidelidade_id: plano.id, status: 'ativo' });
    if (assErr) throw assErr;
    await supabase.from('clientes').update({ plano_fidelidade_id: plano.id }).eq('id', cliente.id);
    assinaturasCount++;
    console.log(`   ✅ Assinatura ${cliente.nome} → ${plano.nome} criada`);
  }
  console.log('');

  console.log('✨ Seed concluído com sucesso!');
  console.log('\n📋 Resumo dos dados criados:');
  console.log(`   - Tenant Admin: ${tenantAdmin.nome} (${tenantAdmin.id})`);
  console.log(`   - Tenant Demo: ${tenantDemo.nome} (${tenantDemo.id})`);
  console.log(`   - Admin Master: ${usuarioAdmin.email}`);
  console.log(`   - Profissionais: ${profissionais.length}`);
  console.log(`   - Serviços: ${servicos.length}`);
  console.log(`   - Clientes: ${clientes.length}`);
  console.log(`   - Produtos: ${produtos.length}`);
  console.log(`   - Planos de Fidelidade: ${planosFidelidade.length}`);
  console.log(`   - Assinaturas: ${assinaturasCount}`);
}

seedDatabase().catch((error) => {
  console.error('❌ Erro durante o seed:', error.message || error);
  process.exit(1);
});
