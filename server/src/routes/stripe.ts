import { stripe } from '../lib/stripe';
import { StripeService } from '../services/stripeService';
import { requireAuth } from '../middlewares/authMiddleware';

const stripeRoutes = async (fastify: any, opts: any) => {
  fastify.post('/stripe/checkout', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const { planoSaasId, email } = request.body;
      const result = await StripeService.createCheckoutSession(request.tenantId, planoSaasId, email);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/stripe/portal', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const result = await StripeService.createPortalSession(request.tenantId);
      return reply.send(result);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Stripe assina o corpo bruto da requisição; request.rawBody é populado pelo
  // content-type parser customizado em index.ts.
  fastify.post('/stripe/webhook', async (request: any, reply: any) => {
    const signature = request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      return reply.status(400).send({ error: 'Webhook not configured' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(request.rawBody, signature, webhookSecret);
    } catch (err: any) {
      return reply.status(400).send({ error: `Webhook signature verification failed: ${err.message}` });
    }

    try {
      await StripeService.handleWebhookEvent(event);
      return reply.send({ received: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default stripeRoutes;
