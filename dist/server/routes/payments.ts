import { Router } from 'express';
import axios from 'axios';
import { storage } from '../storage';
import { logActivity } from '../activityLogger';

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

    // Log test payment initiation
    await logActivity({
      userId: null,
      event: 'TEST_PAYMENT_INITIATED',
      entity: 'payment',
      entityId: tapPayload.reference.order,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        testPayment: true,
        merchantId: tapPayload.merchant.id,
        initiatedAt: new Date().toISOString()
      }
    });

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

    // Log successful test payment creation
    await logActivity({
      userId: null,
      event: 'TEST_PAYMENT_CREATED',
      entity: 'payment',
      entityId: response.data.id,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        tapChargeId: response.data.id,
        paymentUrl: response.data.transaction?.url,
        testPayment: true,
        createdAt: new Date().toISOString(),
        orderReference: tapPayload.reference.order
      }
    });

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
    
    // Log test payment error
    await logActivity({
      userId: null,
      event: 'TEST_PAYMENT_ERROR',
      entity: 'payment',
      entityId: 'test_payment',
      metadata: {
        error: error.response?.data || error.message,
        stack: error.stack,
        testPayment: true,
        failedAt: new Date().toISOString(),
        requestData: req.body
      }
    });
    
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

    // Log activity for payment creation
    await logActivity({
      userId: order.userId || null,
      event: 'PAYMENT_INITIATED',
      entity: 'order',
      entityId: order.id,
      metadata: {
        tapId: response.data.id,
        paymentUrl: response.data.transaction.url,
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'SAR',
        paymentMethod: 'tap',
        initiatedAt: new Date().toISOString()
      }
    });

    // Log additional business event for payment initiation
    await logActivity({
      userId: order.userId || null,
      event: 'BUSINESS_PAYMENT_REQUEST_CREATED',
      entity: 'payment',
      entityId: response.data.id,
      metadata: {
        orderId: order.id,
        orderValue: order.totalAmount,
        currency: 'SAR',
        paymentProvider: 'tap',
        requestedAt: new Date().toISOString()
      }
    });

    res.json({ 
      paymentUrl: response.data.transaction.url,
      tapId: response.data.id 
    });

  } catch (error: any) {
    console.error('Payment creation error:', error.response?.data || error.message);
    
    // Log payment creation failure
    await logActivity({
      userId: req.body.orderId ? null : null, // We don't have easy access to userId here
      event: 'PAYMENT_CREATION_FAILED',
      entity: 'order',
      entityId: req.body.orderId || 'unknown',
      metadata: {
        error: error.response?.data || error.message,
        stack: error.stack,
        requestData: req.body,
        failedAt: new Date().toISOString()
      }
    });
    
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

    // Log webhook receipt
    await logActivity({
      userId: null,
      event: 'TAP_WEBHOOK_RECEIVED',
      entity: 'webhook',
      entityId: tapId || 'unknown',
      metadata: {
        orderId,
        status,
        amount: tapEvent.amount,
        currency: tapEvent.currency,
        webhookData: tapEvent
      }
    });

    if (!orderId) {
      // Log invalid webhook
      await logActivity({
        userId: null,
        event: 'TAP_WEBHOOK_INVALID',
        entity: 'webhook',
        entityId: tapId || 'unknown',
        metadata: {
          error: 'No order reference found',
          receivedData: tapEvent
        }
      });
      
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

    // Log payment status determination
    await logActivity({
      userId: null,
      event: 'TAP_PAYMENT_STATUS_DETERMINED',
      entity: 'payment',
      entityId: tapId,
      metadata: {
        orderId,
        tapStatus: status,
        determinedOrderStatus: orderStatus,
        determinedPaymentStatus: paymentStatus,
        amount: tapEvent.amount,
        currency: tapEvent.currency
      }
    });

    // Update the order
    const updatedOrder = await storage.updateOrder(orderId, {
      status: orderStatus,
      paymentStatus: paymentStatus
    });

    // Log order update
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: 'ORDER_STATUS_UPDATED_BY_WEBHOOK',
      entity: 'order',
      entityId: orderId,
      metadata: {
        tapId,
        previousStatus: updatedOrder?.status,
        newStatus: orderStatus,
        newPaymentStatus: paymentStatus,
        amount: updatedOrder?.totalAmount,
        triggeredBy: 'tap_webhook'
      }
    });

    // Create payment record
    const paymentRecord = await storage.createPayment({
      orderId: orderId,
      amount: updatedOrder?.totalAmount || '0',
      currency: 'SAR',
      transactionId: tapId,
      status: paymentStatus,
      paymentMethod: 'tap'
    });

    // Log payment record creation
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: 'PAYMENT_RECORD_CREATED_BY_WEBHOOK',
      entity: 'payment',
      entityId: paymentRecord?.id || tapId,
      metadata: {
        orderId,
        tapId,
        amount: updatedOrder?.totalAmount || '0',
        currency: 'SAR',
        status: paymentStatus,
        paymentMethod: 'tap',
        createdBy: 'tap_webhook'
      }
    });

    // Log activity for payment status update
    await logActivity({
      userId: updatedOrder?.userId || null,
      event: 'PAYMENT_STATUS_UPDATED',
      entity: 'order',
      entityId: orderId,
      metadata: {
        tapId,
        status,
        orderStatus,
        paymentStatus,
        finalAmount: updatedOrder?.totalAmount,
        webhookProcessed: true,
        processedAt: new Date().toISOString()
      }
    });

    // Additional logging for completed payments
    if (paymentStatus === 'completed') {
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: 'PAYMENT_COMPLETED_VIA_WEBHOOK',
        entity: 'payment',
        entityId: tapId,
        metadata: {
          orderId,
          amount: updatedOrder?.totalAmount,
          currency: 'SAR',
          completedAt: new Date().toISOString(),
          paymentMethod: 'tap',
          completionTrigger: 'tap_webhook'
        }
      });

      // Log business success event
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: 'BUSINESS_TRANSACTION_COMPLETED',
        entity: 'order',
        entityId: orderId,
        metadata: {
          tapId,
          orderValue: updatedOrder?.totalAmount,
          currency: 'SAR',
          paymentProvider: 'tap',
          completedAt: new Date().toISOString()
        }
      });
    }

    // Additional logging for failed payments
    if (paymentStatus === 'failed') {
      await logActivity({
        userId: updatedOrder?.userId || null,
        event: 'PAYMENT_FAILED_VIA_WEBHOOK',
        entity: 'payment',
        entityId: tapId,
        metadata: {
          orderId,
          amount: updatedOrder?.totalAmount,
          currency: 'SAR',
          failureReason: status,
          failedAt: new Date().toISOString(),
          paymentMethod: 'tap',
          failureTrigger: 'tap_webhook'
        }
      });
    }

    res.status(200).json({ success: true, orderId, status: orderStatus });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log webhook processing error
    await logActivity({
      userId: null,
      event: 'TAP_WEBHOOK_PROCESSING_ERROR',
      entity: 'webhook',
      entityId: req.body?.id || 'unknown',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        webhookData: req.body,
        failedAt: new Date().toISOString()
      }
    });
    
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Create payment for direct service purchase
router.post('/create', async (req, res) => {
  try {
    const { amount, currency = 'SAR', description, service } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create Tap payment
    const tapPayload = {
      amount: parseFloat(amount),
      currency: currency,
      threeDSecure: true,
      save_card: false,
      description: description || `Payment for ${service?.title || 'Service'}`,
      statement_descriptor: 'TechPartner',
      customer: {
        first_name: 'Customer',
        middle_name: '',
        last_name: '',
        email: 'customer@techpartner.sa',
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
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`
      },
      reference: {
        transaction: `direct_txn_${Date.now()}`,
        order: `direct_order_${Date.now()}`
      },
      post: {
        url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/webhooks/tap`
      },
      receipt: {
        email: false,
        sms: false
      },
      metadata: {
        service_title: service?.title || 'Unknown Service',
        service_category: service?.category || 'Unknown Category',
        platform: 'techpartner',
        payment_type: 'direct'
      }
    };

    // Log payment initiation
    await logActivity({
      userId: null,
      event: 'DIRECT_PAYMENT_INITIATED',
      entity: 'payment',
      entityId: 'direct_payment',
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        service: service,
        createdAt: new Date().toISOString()
      }
    });

    // Create charge via Tap API
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

    // Log successful payment creation
    await logActivity({
      userId: null,
      event: 'DIRECT_PAYMENT_CREATED',
      entity: 'payment',
      entityId: response.data.id,
      metadata: {
        amount: tapPayload.amount,
        currency: tapPayload.currency,
        tapChargeId: response.data.id,
        paymentUrl: response.data.transaction?.url,
        service: service,
        createdAt: new Date().toISOString()
      }
    });

    res.json({
      success: true,
      chargeId: response.data.id,
      paymentUrl: response.data.transaction?.url,
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency
    });

  } catch (error: any) {
    console.error('Direct payment creation error:', error);
    
    // Log payment creation error
    await logActivity({
      userId: null,
      event: 'DIRECT_PAYMENT_ERROR',
      entity: 'payment',
      entityId: 'direct_payment',
      metadata: {
        error: error?.response?.data || error?.message || 'Unknown error',
        stack: error?.stack,
        requestData: req.body,
        failedAt: new Date().toISOString()
      }
    });
    
    res.status(500).json({ 
      error: 'Failed to create payment',
      details: error?.response?.data || error?.message || 'Unknown error'
    });
  }
});

export default router;
