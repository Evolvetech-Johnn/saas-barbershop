import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  Tenant,
  Usuario,
  Profissional,
  Cliente,
  Servico,
  Agendamento,
  Produto,
  Comanda,
  Comissao,
  PlanoFidelidade,
  AssinaturaPlano
} from '../models';

// ----------------------------------
// DADOS INICIAIS ESSENCIAIS
// ----------------------------------
const DADOS_INICIAIS = {
  tenantAdmin: {
    slug: 'admin',
    nome: 'Painel SaaS Admin',
    corAcento: '#10b981',
    planoSaas: 'premium' as const,
    status: 'ativo' as const,
    dataCriacao: new Date(),
    dataVencimentoPlano: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 ano
  },
  usuarioAdmin: {
    email: 'admin@barbearia-saas.com',
    senhaHash: 'admin123', // Será hash pelo pre-save do Mongoose
    nome: 'Administrador',
    papel: 'admin' as const,
    ativo: true
  },
  tenantDemo: {
    slug: 'classic',
    nome: 'Barbearia Classic',
    logoUrl: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barber%20shop%20logo%20classic%20vintage%20black%20gold&image_size=square',
    corAcento: '#d4af37',
    planoSaas: 'premium' as const,
    status: 'ativo' as const,
    dataCriacao: new Date(),
    dataVencimentoPlano: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    descricaoPublica: 'Barbearia tradicional com estilo clássico, oferecendo cortes precisos e atendimento personalizado.',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo',
    telefone: '(11) 98765-4321',
    horarioFuncionamento: 'Seg-Sex: 9h-19h | Sáb: 9h-17h',
    onboardingConcluido: true
  }
};

// ----------------------------------
// DADOS DE EXEMPLO (PODEM SER REMOVIDOS)
// ----------------------------------
const DADOS_EXEMPLO = {
  profissionais: [
    { nome: 'Carlos', especialidade: ['Corte', 'Barba'], cor: '#d4af37' },
    { nome: 'Ana', especialidade: ['Corte', 'Coloração'], cor: '#f59e0b' }
  ],
  servicos: [
    { nome: 'Corte de Cabelo', preco: 50, duracaoMinutos: 30, comissaoPercentual: 30 },
    { nome: 'Barba', preco: 35, duracaoMinutos: 25, comissaoPercentual: 30 },
    { nome: 'Corte + Barba', preco: 75, duracaoMinutos: 55, comissaoPercentual: 30 },
    { nome: 'Spa da Barba', preco: 60, duracaoMinutos: 40, comissaoPercentual: 35 }
  ],
  clientes: [
    { nome: 'João Silva', telefone: '(11) 98765-4321', email: 'joao@email.com' },
    { nome: 'Maria Santos', telefone: '(11) 91234-5678', email: 'maria@email.com' },
    { nome: 'Pedro Costa', telefone: '(11) 99876-5432' }
  ],
  produtos: [
    { nome: 'Pomada Classic', categoria: 'Cabelo', preco: 45, custo: 20, quantidade: 15, quantidadeMinima: 5 },
    { nome: 'Óleo de Barba', categoria: 'Barba', preco: 35, custo: 15, quantidade: 20, quantidadeMinima: 8 },
    { nome: 'Shampoo Premium', categoria: 'Cabelo', preco: 55, custo: 25, quantidade: 10, quantidadeMinima: 5 }
  ],
  planosFidelidade: [
    { nome: 'Plano Classic', descricao: 'Ideal para clientes frequentes', precoMensal: 49.90, beneficios: ['10% de desconto em todos os serviços', 'Corte mensal grátis', 'Prioridade no agendamento'] },
    { nome: 'Plano Premium', descricao: 'Para quem quer o melhor', precoMensal: 99.90, beneficios: ['20% de desconto em todos os serviços', 'Corte + Barba mensais grátis', 'Prioridade no agendamento', '1 produto grátis por mês'] }
  ]
};

async function seedDatabase() {
  console.log('🚀 Iniciando seed do banco de dados...\n');

  try {
    await connectDatabase();
    console.log('✅ Conexão com banco estabelecida\n');

    // Limpar dados existentes (opcional, para desenvolvimento)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🗑️ Limpando dados existentes (apenas dev)...\n');
      await Tenant.deleteMany({});
      await Usuario.deleteMany({});
      await Profissional.deleteMany({});
      await Cliente.deleteMany({});
      await Servico.deleteMany({});
      await Agendamento.deleteMany({});
      await Produto.deleteMany({});
      await Comanda.deleteMany({});
      await Comissao.deleteMany({});
      await PlanoFidelidade.deleteMany({});
      await AssinaturaPlano.deleteMany({});
    }

    // ----------------------------------
    // 1. Criar Tenant Admin
    // ----------------------------------
    console.log('1️⃣ Criando Tenant Admin...');
    const tenantAdmin = new Tenant(DADOS_INICIAIS.tenantAdmin);
    await tenantAdmin.save();
    console.log(`✅ Tenant Admin criado (${tenantAdmin._id})\n`);

    // ----------------------------------
    // 2. Criar Usuário Admin Master
    // ----------------------------------
    console.log('2️⃣ Criando Usuário Admin Master...');
    const usuarioAdmin = new Usuario({
      tenantId: tenantAdmin._id,
      ...DADOS_INICIAIS.usuarioAdmin
    });
    await usuarioAdmin.save();
    console.log(`✅ Usuário Admin criado (${usuarioAdmin._id})`);
    console.log(`   Email: ${usuarioAdmin.email}`);
    console.log(`   Senha temporária: admin123\n`);

    // ----------------------------------
    // 3. Criar Tenant Demo (Barbearia Classic)
    // ----------------------------------
    console.log('3️⃣ Criando Tenant Demo (Barbearia Classic)...');
    const tenantDemo = new Tenant(DADOS_INICIAIS.tenantDemo);
    await tenantDemo.save();
    console.log(`✅ Tenant Demo criado (${tenantDemo._id})\n`);

    // ----------------------------------
    // A PARTIR DAQUI SÃO DADOS DE EXEMPLO
    // ----------------------------------

    // ----------------------------------
    // 4. Criar Profissionais Demo
    // ----------------------------------
    console.log('4️⃣ Criando Profissionais Demo...');
    const profissionais: any[] = [];
    for (const pData of DADOS_EXEMPLO.profissionais) {
      const profissional = new Profissional({
        tenantId: tenantDemo._id,
        ...pData,
        ativo: true
      });
      await profissional.save();
      profissionais.push(profissional);
      console.log(`   ✅ Profissional ${pData.nome} criado`);
    }
    console.log('');

    // ----------------------------------
    // 5. Criar Serviços Demo
    // ----------------------------------
    console.log('5️⃣ Criando Serviços Demo...');
    const servicos: any[] = [];
    for (const sData of DADOS_EXEMPLO.servicos) {
      const servico = new Servico({
        tenantId: tenantDemo._id,
        ...sData,
        ativo: true
      });
      await servico.save();
      servicos.push(servico);
      console.log(`   ✅ Serviço ${sData.nome} criado`);
    }
    console.log('');

    // ----------------------------------
    // 6. Criar Clientes Demo
    // ----------------------------------
    console.log('6️⃣ Criando Clientes Demo...');
    const clientes: any[] = [];
    for (const cData of DADOS_EXEMPLO.clientes) {
      const cliente = new Cliente({
        tenantId: tenantDemo._id,
        ...cData,
        ativo: true
      });
      await cliente.save();
      clientes.push(cliente);
      console.log(`   ✅ Cliente ${cData.nome} criado`);
    }
    console.log('');

    // ----------------------------------
    // 7. Criar Produtos Demo
    // ----------------------------------
    console.log('7️⃣ Criando Produtos Demo...');
    const produtos: any[] = [];
    for (const pData of DADOS_EXEMPLO.produtos) {
      const produto = new Produto({
        tenantId: tenantDemo._id,
        ...pData,
        ativo: true
      });
      await produto.save();
      produtos.push(produto);
      console.log(`   ✅ Produto ${pData.nome} criado`);
    }
    console.log('');

    // ----------------------------------
    // 8. Criar Planos de Fidelidade Demo
    // ----------------------------------
    console.log('8️⃣ Criando Planos de Fidelidade Demo...');
    const planosFidelidade: any[] = [];
    for (const pfData of DADOS_EXEMPLO.planosFidelidade) {
      const plano = new PlanoFidelidade({
        tenantId: tenantDemo._id,
        ...pfData,
        ativo: true
      });
      await plano.save();
      planosFidelidade.push(plano);
      console.log(`   ✅ Plano ${pfData.nome} criado`);
    }
    console.log('');

    // ----------------------------------
    // 9. Criar Assinaturas Demo (para clientes)
    // ----------------------------------
    console.log('9️⃣ Criando Assinaturas Demo...');
    const assinaturas: any[] = [];
    for (let i = 0; i < clientes.length; i++) {
      const cliente = clientes[i];
      const plano = planosFidelidade[i % planosFidelidade.length];
      const assinatura = new AssinaturaPlano({
        tenantId: tenantDemo._id,
        clienteId: cliente._id,
        planoFidelidadeId: plano._id,
        status: 'ativo'
      });
      await assinatura.save();
      assinaturas.push(assinatura);
      cliente.planoFidelidadeId = plano._id;
      await cliente.save();
      console.log(`   ✅ Assinatura ${cliente.nome} → ${plano.nome} criada`);
    }
    console.log('');

    console.log('✨ Seed concluído com sucesso!');
    console.log('\n📋 Resumo dos dados criados:');
    console.log(`   - Tenant Admin: ${tenantAdmin.nome} (${tenantAdmin._id})`);
    console.log(`   - Tenant Demo: ${tenantDemo.nome} (${tenantDemo._id})`);
    console.log(`   - Admin Master: ${usuarioAdmin.email}`);
    console.log(`   - Profissionais: ${profissionais.length}`);
    console.log(`   - Serviços: ${servicos.length}`);
    console.log(`   - Clientes: ${clientes.length}`);
    console.log(`   - Produtos: ${produtos.length}`);
    console.log(`   - Planos de Fidelidade: ${planosFidelidade.length}`);
    console.log(`   - Assinaturas: ${assinaturas.length}`);

  } catch (error: any) {
    console.error('❌ Erro durante o seed:', error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seedDatabase();
