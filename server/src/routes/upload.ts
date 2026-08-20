import { cloudinary } from '../lib/cloudinary';
import { requireAuth } from '../middlewares/authMiddleware';

const uploadRoutes = async (fastify: any, opts: any) => {
  fastify.post('/upload', { preHandler: requireAuth }, async (request: any, reply: any) => {
    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ error: 'Nenhum arquivo enviado' });
    }
    if (!file.mimetype.startsWith('image/')) {
      return reply.status(400).send({ error: 'Só imagens são aceitas' });
    }

    try {
      const resultado = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `barbearia-saas/${request.tenantId}`, resource_type: 'image' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        file.file.pipe(stream);
      });

      return reply.send({ url: resultado.secure_url });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message || 'Falha no upload da imagem' });
    }
  });
};

export default uploadRoutes;
