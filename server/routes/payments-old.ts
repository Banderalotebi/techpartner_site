import { Router } from 'express';
import axios from 'axios';
import { storage } from '../storage';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// Create payment for order
router.post('/payments', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.body;

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order
    if (order.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order is not in pending status' });
    }

    // Create Tap payment
    const tapPayload = {
      amount: order.amount,
      currency: 'SAR',
      threeDSecure: true,
      save_card: false,
      description: `Payment for Order #${order.id}`,
      statement_descriptor: 'TechPartner',
      customer: {
        first_name: order.user?.firstName || 'Customer',
        middle_name: '',
        last_name: order.user?.lastName || '',
        email: order.user?.email || order.email,
        phone: {
          country_code: '966',
          number: '500000000'
        }
      },
      merchant: {
        id: process.env.TAP_MERCHANT_ID || '67967090'
      },
      source: { 
        id: 'src_all' 
      },
      redirect: {
        url: `${process.env.FRONTEND_URL}/payment/success?order=${order.id}`
      },
      reference: {
        transaction: `txn_${order.id}_${Date.now()}`,
        order: order.id.toString()
      },
      post: {
        url: `${process.env.FRONTEND_URL}/api/webhooks/tap`
      },
      receipt: {
        email: true,
        sms: false
      },
      metadata: {
        order_id: order.id.toString(),
        user_id: order.userId.toString(),
        platform: 'techpartner'
      }
    };

    const response = await axios.post(
      'https://api.tap.company/v2/charges',
      tapPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log activity
    await prisma.activity.create({
      data: {
        userId: req.user!.id,
        event: 'PAYMENT_INITIATED',
        metadata: JSON.stringify({ 
          orderId: order.id, 
          tapId: response.data.id,
          amount: order.amount 
        })
      }
    });

    res.json({ 
      paymentUrl: response.data.transaction.url,
      tapId: response.data.id 
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Tap webhook endpoint
router.post('/webhooks/tap', async (req, res) => {
  try {
    const tapEvent = req.body;
    const orderId = tapEvent.reference?.order;
    const tapId = tapEvent.id;
    const status = tapEvent.status;

    console.log('Tap webhook received:', { orderId, tapId, status });

    if (!orderId) {
      return res.status(400).json({ error: 'No order reference found' });
    }

    // Update order based on payment status
    let orderStatus = 'PENDING';
    let paidAt = null;

    switch (status) {
      case 'CAPTURED':
        orderStatus = 'PAID';
        paidAt = new Date();
        break;
      case 'FAILED':
      case 'DECLINED':
        orderStatus = 'FAILED';
        break;
      case 'CANCELLED':
        orderStatus = 'CANCELLED';
        break;
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        tapId,
        paidAt
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        event: 'PAYMENT_WEBHOOK_RECEIVED',
        metadata: JSON.stringify({ 
          orderId, 
          tapId, 
          status, 
          orderStatus 
        })
      }
    });

    // If payment was successful, create additional success activity
    if (status === 'CAPTURED') {
      await prisma.activity.create({
        data: {
          userId: updatedOrder.userId,
          event: 'PAYMENT_SUCCESS',
          metadata: JSON.stringify({ 
            orderId, 
            tapId, 
            amount: updatedOrder.amount 
          })
        }
      });
    }

    res.status(200).json({ success: true, orderId, status: orderStatus });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Test Tap payment integration (development only)
router.post('/test-payment', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint not available in production' });
  }

  try {
    const { amount = 1, currency = 'SAR' } = req.body;

    const tapPayload = {
      amount: parseFloat(amount),
      currency,
      threeDSecure: true,
      save_card: false,
      description: 'Test payment for TechPartner integration',
      statement_descriptor: 'TechPartner Test',
      customer: {
        first_name: 'Test',
        middle_name: '',
        last_name: 'User',
        email: 'test@techpartner.sa',
        phone: {
          country_code: '966',
          number: '500000000'
        }
      },
      merchant: {
        id: process.env.TAP_MERCHANT_ID || '67967090'
      },
      source: { 
        id: 'src_all' 
      },
      redirect: {
        url: `${process.env.FRONTEND_URL}/payment/test-success`
      },
      reference: {
        transaction: `test_txn_${Date.now()}`,
        order: `test_order_${Date.now()}`
      },
      post: {
        url: `${process.env.FRONTEND_URL}/api/webhooks/tap`
      },
      receipt: {
        email: false,
        sms: false
      },
      metadata: {
        test: 'true',
        platform: 'techpartner'
      }
    };

    console.log('Creating test payment with payload:', JSON.stringify(tapPayload, null, 2));

    const response = await axios.post(
      'https://api.tap.company/v2/charges',
      tapPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Tap API Response:', response.data);

    res.json({ 
      success: true,
      paymentUrl: response.data.transaction?.url,
      tapId: response.data.id,
      status: response.data.status,
      message: 'Test payment created successfully'
    });

  } catch (error: any) {
    console.error('Test payment error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create test payment',
      details: error.response?.data || error.message
    });
  }
});

export default router;
