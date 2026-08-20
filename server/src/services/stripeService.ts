import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function getOrCreateStripeCustomer(tenantId: string, email?: string): Promise<string> {
  const { data: tenant, error } = await supabase.from('tenants').select('id,nome,stripe_customer_id').eq('id', tenantId).single();
  if (error) throw new Error(error.message);
  if (tenant.stripe_customer_id) return tenant.stripe_customer_id;

  const customer = await stripe.customers.create({ name: tenant.nome, email, metadata: { tenantId } });
  await supabase.from('tenants').update({ stripe_customer_id: customer.id }).eq('id', tenantId);
  return customer.id;
}

export class StripeService {
  static async createCheckoutSession(tenantId: string, planoSaasId: string, email?: string) {
    const { data: plano, error: planoError } = await supabase.from('planos_saas').select('*').eq('id', planoSaasId).single();
    if (planoError) throw new Error(planoError.message);
    if (!plano.stripe_price_id) throw new Error('Este plano ainda não tem um Stripe Price ID configurado.');

    const customerId = await getOrCreateStripeCustomer(tenantId, email);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plano.stripe_price_id, quantity: 1 }],
      success_url: `${FRONTEND_URL}/app/assinatura?checkout=sucesso`,
      cancel_url: `${FRONTEND_URL}/app/assinatura?checkout=cancelado`,
      metadata: { tenantId, planoCodigo: plano.codigo },
      subscription_data: { metadata: { tenantId, planoCodigo: plano.codigo } },
    });

    return { url: session.url };
  }

  static async createPortalSession(tenantId: string) {
    const { data: tenant, error } = await supabase.from('tenants').select('stripe_customer_id').eq('id', tenantId).single();
    if (error) throw new Error(error.message);
    if (!tenant.stripe_customer_id) throw new Error('Este tenant ainda não tem uma assinatura Stripe.');

    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: `${FRONTEND_URL}/app/assinatura`,
    });
    return { url: session.url };
  }

  static async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenantId;
        const planoCodigo = session.metadata?.planoCodigo;
        if (tenantId && planoCodigo) {
          await supabase.from('tenants').update({ plano_saas: planoCodigo, status: 'ativo' }).eq('id', tenantId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const tenantId = sub.metadata?.tenantId;
        if (!tenantId) break;

        const status = sub.status === 'active' || sub.status === 'trialing' ? 'active' : sub.status === 'past_due' ? 'past_due' : sub.status === 'canceled' ? 'canceled' : 'unpaid';

        const item = sub.items.data[0];
        await supabase.from('assinaturas').upsert(
          {
            tenant_id: tenantId,
            stripe_subscription_id: sub.id,
            stripe_price_id: item?.price?.id,
            status,
            periodo_atual_fim: item ? new Date(item.current_period_end * 1000).toISOString() : null,
          },
          { onConflict: 'tenant_id' }
        );

        if (status === 'past_due') await supabase.from('tenants').update({ status: 'vencido' }).eq('id', tenantId);
        else if (status === 'active') await supabase.from('tenants').update({ status: 'ativo' }).eq('id', tenantId);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const tenantId = sub.metadata?.tenantId;
        if (!tenantId) break;
        await supabase.from('assinaturas').update({ status: 'canceled' }).eq('tenant_id', tenantId);
        await supabase.from('tenants').update({ status: 'inativo' }).eq('id', tenantId);
        break;
      }

      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const tenantId = (invoice.parent?.subscription_details?.metadata as any)?.tenantId;
        if (!tenantId) break;

        await supabase.from('faturas').upsert(
          {
            tenant_id: tenantId,
            stripe_invoice_id: invoice.id,
            valor: (invoice.amount_paid || invoice.amount_due) / 100,
            status: event.type === 'invoice.paid' ? 'paga' : 'vencida',
            vencimento: new Date((invoice.due_date || invoice.created) * 1000).toISOString(),
            pago_em: event.type === 'invoice.paid' ? new Date().toISOString() : null,
          },
          { onConflict: 'stripe_invoice_id' }
        );
        break;
      }

      default:
        break;
    }
  }
}
