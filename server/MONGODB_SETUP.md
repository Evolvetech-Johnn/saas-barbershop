# MongoDB Atlas Connection Diagnostic

## Status Atual
❌ **Conexão com falha**: `bad auth : authentication failed`

## Causa Identificada
A senha `aNWGlP7d4onseCAy` não está sendo reconhecida pelo MongoDB Atlas. Isso pode indicar:

1. **Senha expirada ou regenerada** — A senha no `.env` não corresponde à senha atual do usuário no Atlas
2. **Usuário não ativo** — O usuário está com status "Pending" em vez de "Active"
3. **Permissões insuficientes** — O usuário não tem permissão para acessar os bancos de dados

## Como Resolver

### Passo 1: Regenerar a Senha no Atlas
1. Acesse [MongoDB Atlas Dashboard](https://cloud.mongodb.com/)
2. Vá para **Database Access** no painel esquerdo
3. Encontre o usuário `evolvebarbershopldn_db_user`
4. Clique em **Edit** ao lado do usuário
5. Clique em **Change Password** (ou **Autogenerate Secure Password**)
6. Copie a nova senha que aparecerá

### Passo 2: Obter a String de Conexão Correta
1. Volte ao painel principal de **Clusters**
2. Clique em **Connect** ao lado do seu cluster
3. Selecione **Drivers** (não Application)
4. Escolha **Node.js** como linguagem
5. Copie a **Legacy URI String** (a que começa com `mongodb://`, não `mongodb+srv://`)
6. A senha já virá preenchida no campo copiável

### Passo 3: Atualizar o `.env` Localmente
Cole a string exata que o Atlas ofereceu no seu arquivo [server/.env](server/.env):

```env
MONGODB_URI="mongodb://evolvebarbershopldn_db_user:NOVA_SENHA_AQUI@ac-3sdhjei-shard-00-00.ac1emd7.mongodb.net:27017,..."
```

### Passo 4: Testar a Conexão
Execute na pasta `server/`:
```bash
npm run dev
```

Você deve ver no log:
```
[DB] ✓ MongoDB connection successful
```

## Estrutura de Arquivos Criada

### `/server/src/config/database.ts`
- **Propósito**: Gerenciar a conexão com MongoDB Atlas
- **Funções**:
  - `connectDatabase()` — Conecta ao Atlas e testa com `ping()`
  - `disconnectDatabase()` — Desconecta gracefully
  - `getDatabase()` — Retorna a instância do banco para uso em rotas/controllers

### `/server/src/index.ts` (modificado)
- **Alteração**: Agora chama `connectDatabase()` antes de iniciar o servidor
- **Graceful Shutdown**: Desconecta do MongoDB ao receber SIGTERM/SIGINT

### `/server/.env.example` (documentado)
- **Novo**: Instruções claras sobre como montar a `MONGODB_URI`
- **Referência**: Ajuda futuro (você ou outro dev) a configurar rapidamente

## Próximos Passos

1. **Regenere a senha e copie a URI exata do Atlas**
2. **Atualize o `.env` e teste de novo**
3. Uma vez conectado, você pode:
   - Criar models de dados com MongoDB (collections)
   - Integrar Mongoose ou usar o driver nativo
   - Configurar Cloudinary (próxima tarefa)

## Troubleshooting Adicional

Se ainda receber `bad auth`:
- Verifique se o usuário está **Active** (não Pending) em Database Access
- Regenere a senha novamente
- Teste a conexão direto no MongoDB Shell para validar credenciais

Se receber erro de rede (DNS/ECONNREFUSED):
- Verifique se seu IP está liberado em **Network Access** (adicione `0.0.0.0/0` para testes)
- Use a Legacy URI (formato com portas explícitas), não a `mongodb+srv://`
