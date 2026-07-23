import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Produto from '../src/models/Produto';
import Tenant from '../src/models/Tenant';
import { connectDatabase } from '../src/config/database';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const produtos = [
  { nome: 'Talco profissional, 100 g', marca: 'Enox', preco: 18.00 },
  { nome: 'Gel para barbear, 500 g', marca: 'Bozzano', preco: 29.90 },
  { nome: 'Shampoo para barba e cabelo', marca: 'Big Barber', preco: 24.90 },
  { nome: 'Balm para barba, 140 ml', marca: 'Barba Forte', preco: 39.90 },
  { nome: 'Óleo para barba, 30 ml', marca: 'Muchacho', preco: 34.90 },
  { nome: 'Pomada modeladora, 150 g', marca: 'Fox For Men', preco: 25.00 },
  { nome: 'Pomada efeito seco, 120 g', marca: 'QOD Barber Shop', preco: 39.90 },
  { nome: 'Loção pós-barba, 500 ml', marca: 'Salles Profissional', preco: 44.90 },
  { nome: 'Shampoo profissional, 1 litro', marca: 'L’Oréal Professionnel', preco: 119.90 },
  { nome: 'Condicionador profissional, 1 litro', marca: 'Truss', preco: 139.90 },
  { nome: 'Máscara de hidratação, 1 kg', marca: 'Wella Professionals', preco: 189.90 },
  { nome: 'Máscara de reconstrução, 500 g', marca: 'Forever Liss', preco: 59.90 },
  { nome: 'Protetor térmico, 200 ml', marca: 'Truss', preco: 89.90 },
  { nome: 'Leave-in profissional, 250 ml', marca: 'Kérastase', preco: 169.90 },
  { nome: 'Pó descolorante, 300 g', marca: 'Amend', preco: 64.81 },
  { nome: 'Pó descolorante profissional, 400 g', marca: 'Itallian Color', preco: 132.60 },
  { nome: 'Água oxigenada, 900 ml', marca: 'Yamá', preco: 29.90 },
  { nome: 'Coloração profissional, 60 g', marca: 'Wella Koleston Perfect', preco: 49.90 },
  { nome: 'Kit para descoloração profissional', marca: 'Dyusar Cosméticos', preco: 78.90 },
  { nome: 'Reparador de pontas, 60 ml', marca: 'Amend', preco: 32.90 },
  { nome: 'Spray fixador, 400 ml', marca: 'Charming', preco: 39.90 },
  { nome: 'Óleo capilar, 100 ml', marca: 'Wella Professionals', preco: 89.90 },
];

async function seed() {
  await connectDatabase();
  
  // Find the active tenant
  const tenant = await Tenant.findOne();
  if (!tenant) {
    console.error('No tenant found!');
    process.exit(1);
  }
  
  console.log(`Seeding products for tenant: ${tenant.nome}`);
  
  // Create products
  const productsToInsert = produtos.map(p => ({
    tenantId: tenant._id,
    nome: `${p.nome} - ${p.marca}`,
    categoria: 'Cosméticos / Barba / Cabelo',
    preco: p.preco,
    custo: p.preco * 0.5, // Mocking cost as 50%
    quantidade: 10,       // Default initial stock
    quantidadeMinima: 3,  
    ativo: true
  }));
  
  await Produto.insertMany(productsToInsert);
  
  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch(console.error);
