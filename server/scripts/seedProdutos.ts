import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const produtos = [
  { nome: 'Talco profissional, 100 g', marca: 'Enox', preco: 18.0 },
  { nome: 'Gel para barbear, 500 g', marca: 'Bozzano', preco: 29.9 },
  { nome: 'Shampoo para barba e cabelo', marca: 'Big Barber', preco: 24.9 },
  { nome: 'Balm para barba, 140 ml', marca: 'Barba Forte', preco: 39.9 },
  { nome: 'Óleo para barba, 30 ml', marca: 'Muchacho', preco: 34.9 },
  { nome: 'Pomada modeladora, 150 g', marca: 'Fox For Men', preco: 25.0 },
  { nome: 'Pomada efeito seco, 120 g', marca: 'QOD Barber Shop', preco: 39.9 },
  { nome: 'Loção pós-barba, 500 ml', marca: 'Salles Profissional', preco: 44.9 },
  { nome: 'Shampoo profissional, 1 litro', marca: "L'Oréal Professionnel", preco: 119.9 },
  { nome: 'Condicionador profissional, 1 litro', marca: 'Truss', preco: 139.9 },
  { nome: 'Máscara de hidratação, 1 kg', marca: 'Wella Professionals', preco: 189.9 },
  { nome: 'Máscara de reconstrução, 500 g', marca: 'Forever Liss', preco: 59.9 },
  { nome: 'Protetor térmico, 200 ml', marca: 'Truss', preco: 89.9 },
  { nome: 'Leave-in profissional, 250 ml', marca: 'Kérastase', preco: 169.9 },
  { nome: 'Pó descolorante, 300 g', marca: 'Amend', preco: 64.81 },
  { nome: 'Pó descolorante profissional, 400 g', marca: 'Itallian Color', preco: 132.6 },
  { nome: 'Água oxigenada, 900 ml', marca: 'Yamá', preco: 29.9 },
  { nome: 'Coloração profissional, 60 g', marca: 'Wella Koleston Perfect', preco: 49.9 },
  { nome: 'Kit para descoloração profissional', marca: 'Dyusar Cosméticos', preco: 78.9 },
  { nome: 'Reparador de pontas, 60 ml', marca: 'Amend', preco: 32.9 },
  { nome: 'Spray fixador, 400 ml', marca: 'Charming', preco: 39.9 },
  { nome: 'Óleo capilar, 100 ml', marca: 'Wella Professionals', preco: 89.9 },
];

async function seed() {
  const { supabase } = await import('../src/lib/supabase');
  const { data: tenant, error: tenantErr } = await supabase.from('tenants').select('id,nome').limit(1).maybeSingle();
  if (tenantErr) throw tenantErr;
  if (!tenant) {
    console.error('No tenant found!');
    process.exit(1);
  }
  console.log(`Seeding products for tenant: ${tenant.nome}`);

  const productsToInsert = produtos.map((p) => ({
    tenant_id: tenant.id,
    nome: `${p.nome} - ${p.marca}`,
    categoria: 'Cosméticos / Barba / Cabelo',
    preco: p.preco,
    custo: p.preco * 0.5,
    quantidade: 10,
    quantidade_minima: 3,
    ativo: true,
  }));

  const { error } = await supabase.from('produtos').insert(productsToInsert);
  if (error) throw error;

  console.log('Seeding completed!');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
