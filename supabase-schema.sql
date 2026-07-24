-- SQL Schema para Supabase
-- Tabelas necessárias para as funcionalidades de Promoções e Conteúdos Informativos.
-- Você precisará rodar isso no painel SQL do seu projeto no Supabase.

-- Tabela de Promoções
CREATE TABLE promocoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id VARCHAR NOT NULL,
  titulo VARCHAR NOT NULL,
  descricao TEXT NOT NULL,
  destaque BOOLEAN DEFAULT FALSE,
  imagem_url VARCHAR,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS e Políticas para Promoções
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura por tenant (promocoes)" ON promocoes
  FOR SELECT USING (true); -- Controle será feito via backend/Fastify buscando por tenant_id

-- Tabela de Conteúdos Informativos
CREATE TABLE conteudos_publicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id VARCHAR NOT NULL,
  titulo VARCHAR NOT NULL,
  resumo TEXT NOT NULL,
  categoria VARCHAR NOT NULL, -- 'dica', 'curiosidade', 'novidade'
  conteudo_completo TEXT,
  imagem_url VARCHAR,
  data_publicacao TIMESTAMP WITH TIME ZONE NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS e Políticas para Conteúdos
ALTER TABLE conteudos_publicos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura por tenant (conteudos)" ON conteudos_publicos
  FOR SELECT USING (true);
