import { Router } from 'express';
import axios from 'axios';
import { storage } from '../storage';

const router = Router();

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

// Create payment for order
router.post('/payments', async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get the order
    const order = await storage.getOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ error: 'Order is not in pending status' });
    }

    // Get user details (if available)
    const user = order.userId ? await storage.getUser(order.userId) : null;

    // Create Tap payment
    const tapPayload = {
      amount: parseFloat(order.totalAmount),
      currency: 'SAR',
      threeDSecure: true,
      save_card: false,
      description: `Payment for Order #${order.id}`,
      statement_descriptor: 'TechPartner',
      customer: {
        first_name: user?.firstName || 'Customer',
        middle_name: '',
        last_name: user?.lastName || '',
        email: user?.email || 'customer@techpartner.sa',
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
        user_id: order.userId?.toString() || 'guest',
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

    res.json({ 
      paymentUrl: response.data.transaction.url,
      tapId: response.data.id 
    });

  } catch (error: any) {
    console.error('Payment creation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Tap webhook endpoint
router.post('/webhooks/tap', async (req, res) => {
  try {
    const tapEvent = req.body;
    const orderId = parseInt(tapEvent.reference?.order);
    const tapId = tapEvent.id;
    const status = tapEvent.status;

    console.log('Tap webhook received:', { orderId, tapId, status });

    if (!orderId) {
      return res.status(400).json({ error: 'No order reference found' });
    }

    // Update order based on payment status
    let orderStatus = 'pending';
    let paymentStatus = 'pending';

    switch (status) {
      case 'CAPTURED':
        orderStatus = 'completed';
        paymentStatus = 'completed';
        break;
      case 'FAILED':
      case 'DECLINED':
        orderStatus = 'failed';
        paymentStatus = 'failed';
        break;
      case 'CANCELLED':
        orderStatus = 'cancelled';
        paymentStatus = 'cancelled';
        break;
    }

    // Update the order
    const updatedOrder = await storage.updateOrder(orderId, {
      status: orderStatus,
      paymentStatus: paymentStatus
    });

    // Create payment record
    await storage.createPayment({
      orderId: orderId,
      amount: updatedOrder?.totalAmount || '0',
      currency: 'SAR',
      transactionId: tapId,
      status: paymentStatus,
      paymentMethod: 'tap'
    });

    res.status(200).json({ success: true, orderId, status: orderStatus });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
