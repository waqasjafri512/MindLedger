import express from 'express';
import { stripe } from '../lib/stripe';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validate } from '../lib/validation';
import { z } from 'zod';

const router = express.Router();

// --- Checkout Session ---

const checkoutSchema = z.object({
  plan: z.enum(['pro', 'team']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

router.post('/create-checkout', authenticateToken, validate(checkoutSchema), async (req: AuthRequest, res) => {
  const { plan, successUrl, cancelUrl } = req.body;
  const userId = req.user?.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    let priceId = '';
    if (plan === 'pro') priceId = process.env.STRIPE_PRO_PLAN_ID || '';
    if (plan === 'team') priceId = process.env.STRIPE_TEAM_PLAN_ID || '';

    if (!priceId) {
      return res.status(400).json({ error: 'Plan price ID not configured on server.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user.email,
      client_reference_id: userId,
      metadata: { userId, plan },
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe session creation failed', err);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});

// --- Webhook Handler ---

// Note: This route requires the raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.client_reference_id;
      const plan = session.metadata.plan;
      const customerId = session.customer;
      const subscriptionId = session.subscription;

      await prisma.user.update({
        where: { id: userId },
        data: { 
          plan, 
          stripeCustomerId: customerId, 
          stripeSubscriptionId: subscriptionId 
        },
      });
      console.log(`User ${userId} upgraded to ${plan}`);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: 'free', stripeSubscriptionId: null },
        });
        console.log(`User ${user.id} subscription canceled.`);
      }
      break;
    }
  }

  res.json({ received: true });
});

export default router;
