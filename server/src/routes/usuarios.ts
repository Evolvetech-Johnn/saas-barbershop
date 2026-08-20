import { UsuarioService } from '../services/usuarioService';
import { ProfissionalService } from '../services/profissionalService';
import { requireAuth } from '../middlewares/authMiddleware';
import { gerarSenhaTemporaria } from '../lib/senhaTemporaria';

// Gestão de contas de acesso (funcionários) da própria barbearia.
// Só o dono (papel admin) pode criar/editar/remover — os demais só listam.
// Acesso com papel "profissional" mantém um registro espelho em `profissionais`,
// que é o que aparece na agenda pros clientes escolherem.
const usuariosRoutes = async (fastify: any, opts: any) => {
  fastify.get('/usuarios', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const usuarios = await UsuarioService.getAll(request.tenantId);
      return reply.send(usuarios.map(({ senhaHash, ...u }) => u));
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/usuarios', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      if (request.userRole !== 'admin') {
        return reply.status(403).send({ error: 'Somente o administrador da barbearia pode criar acessos.' });
      }
      const { email, nome, papel } = request.body;
      if (!email || !nome) {
        return reply.status(400).send({ error: 'E-mail e nome são obrigatórios' });
      }
      const papelPermitido = ['profissional', 'recepcao'].includes(papel) ? papel : 'profissional';

      const existente = await UsuarioService.getByEmail(request.tenantId, email);
      if (existente) {
        return reply.status(400).send({ error: 'Já existe um usuário com esse e-mail nesta barbearia.' });
      }

      const senhaTemporaria = gerarSenhaTemporaria();
      const usuario = await UsuarioService.create({
        tenantId: request.tenantId,
        email,
        nome,
        papel: papelPermitido,
        senhaHash: senhaTemporaria,
        ativo: true,
      });

      if (papelPermitido === 'profissional') {
        await ProfissionalService.create({ tenantId: request.tenantId, usuarioId: usuario.id, nome: usuario.nome, especialidade: [], ativo: true });
      }

      const { senhaHash, ...usuarioSemSenha } = usuario;
      return reply.status(201).send({ ...usuarioSemSenha, senhaTemporaria });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/usuarios/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      if (request.userRole !== 'admin') {
        return reply.status(403).send({ error: 'Somente o administrador da barbearia pode editar acessos.' });
      }
      const { nome, papel, ativo } = request.body;
      const atualizado = await UsuarioService.update(request.tenantId, request.params.id, { nome, papel, ativo });
      if (!atualizado) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      // Mantém o registro espelho em profissionais em sincronia (nome/status).
      const profissionalVinculado = await ProfissionalService.getByUsuarioId(request.tenantId, atualizado.id);
      if (profissionalVinculado) {
        await ProfissionalService.update(request.tenantId, profissionalVinculado.id, {
          nome: atualizado.nome,
          ativo: atualizado.ativo,
        });
      }

      const { senhaHash, ...usuarioSemSenha } = atualizado;
      return reply.send(usuarioSemSenha);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/usuarios/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      if (request.userRole !== 'admin') {
        return reply.status(403).send({ error: 'Somente o administrador da barbearia pode remover acessos.' });
      }
      if (request.params.id === request.user?.sub) {
        return reply.status(400).send({ error: 'Você não pode remover o próprio acesso.' });
      }
      const removido = await UsuarioService.softDelete(request.tenantId, request.params.id);
      if (!removido) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      const profissionalVinculado = await ProfissionalService.getByUsuarioId(request.tenantId, removido.id);
      if (profissionalVinculado) {
        await ProfissionalService.softDelete(request.tenantId, profissionalVinculado.id);
      }

      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default usuariosRoutes;
