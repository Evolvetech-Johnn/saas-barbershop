import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase, disconnectDatabase } from './src/config/database';
import { Tenant, Servico, PlanoFidelidade } from './src/models';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const combos = [
  { nome: 'Essencial', descricao: 'Corte tradicional + finalização', preco: 45, duracao: 30 },
  { nome: 'Corte completo', descricao: 'Corte + lavagem + finalização', preco: 55, duracao: 40 },
  { nome: 'Corte e barba', descricao: 'Corte + alinhamento de barba', preco: 70, duracao: 50 },
  { nome: 'Clássico', descricao: 'Corte + barboterapia com toalha quente', preco: 85, duracao: 60 },
  { nome: 'Premium', descricao: 'Corte + barboterapia + sobrancelha', preco: 95, duracao: 70 },
  { nome: 'Black', descricao: 'Corte + barboterapia + sobrancelha + depilação de nariz e orelhas', preco: 125, duracao: 90 },
  { nome: 'Dia de cuidado', descricao: 'Corte + barba + limpeza facial express + sobrancelha', preco: 145, duracao: 120 },
  { nome: 'Pai e filho', descricao: 'Dois cortes, sendo um infantil', preco: 70, duracao: 60 },
  { nome: 'Noivo essencial', descricao: 'Corte + barba + sobrancelha + penteado', preco: 140, duracao: 90 },
  { nome: 'Dia do noivo completo', descricao: 'Corte, barba, hidratação, limpeza facial, mãos e massagem', preco: 300, duracao: 180 },
];

const planos = [
  { nome: 'Corte mensal', descricao: 'Até 4 cortes', precoMensal: 130, beneficios: ['Até 4 cortes'] },
  { nome: 'Barba mensal', descricao: 'Até 4 atendimentos de barba', precoMensal: 110, beneficios: ['Até 4 atendimentos de barba'] },
  { nome: 'Corte e barba', descricao: 'Até 4 cortes e 4 barbas', precoMensal: 220, beneficios: ['Até 4 cortes', 'Até 4 barbas'] },
  { nome: 'Plano executivo', descricao: '4 cortes, 4 barbas e 2 sobrancelhas', precoMensal: 240, beneficios: ['4 cortes', '4 barbas', '2 sobrancelhas'] },
  { nome: 'Plano ilimitado', descricao: 'Corte e barba conforme regras da casa', precoMensal: 250, beneficios: ['Cortes e barbas ilimitadas (regras da casa)'] },
];

async function seed() {
  await connectDatabase();
  
  // Try to find the first tenant
  const tenant = await Tenant.findOne();
  if (!tenant) {
    console.error('Nenhum Tenant encontrado! Crie um usuário primeiro.');
    await disconnectDatabase();
    process.exit(1);
  }

  console.log(`Usando Tenant: ${tenant.nome} (${tenant._id})`);

  // Insert Combos (Servicos)
  for (const combo of combos) {
    const exists = await Servico.findOne({ tenantId: tenant._id, nome: combo.nome });
    if (!exists) {
      await Servico.create({
        tenantId: tenant._id,
        nome: combo.nome,
        descricao: combo.descricao,
        preco: combo.preco,
        duracao: combo.duracao
      });
      console.log(`[+] Combo criado: ${combo.nome}`);
    } else {
      console.log(`[-] Combo já existe: ${combo.nome}`);
    }
  }

  // Insert Planos
  for (const plano of planos) {
    const exists = await PlanoFidelidade.findOne({ tenantId: tenant._id, nome: plano.nome });
    if (!exists) {
      await PlanoFidelidade.create({
        tenantId: tenant._id,
        nome: plano.nome,
        descricao: plano.descricao,
        precoMensal: plano.precoMensal,
        beneficios: plano.beneficios
      });
      console.log(`[+] Plano criado: ${plano.nome}`);
    } else {
      console.log(`[-] Plano já existe: ${plano.nome}`);
    }
  }

  console.log('✅ Seeding concluído!');
  await disconnectDatabase();
}

seed().catch(console.error);
