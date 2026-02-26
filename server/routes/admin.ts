import { Router } from 'express';
import { db } from '../db';
import { orders, payments, activities, users, servicePackages } from '../../shared/schema';
import { eq, desc, count, sum, and } from 'drizzle-orm';
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth';

const router = Router();

// Get admin dashboard data
router.get('/admin/dashboard', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    // Get order statistics
    const [totalOrdersResult] = await db.select({ count: count() }).from(orders);
    const [paidOrdersResult] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'PAID'));
    const [pendingOrdersResult] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'PENDING'));
    
    // Get revenue
    const [revenueResult] = await db.select({ 
      total: sum(orders.totalAmount) 
    }).from(orders).where(eq(orders.paymentStatus, 'paid'));

    // Get recent orders
    const recentOrders = await db.select({
      id: orders.id,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
      userEmail: users.email,
      serviceName: servicePackages.name,
    })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(servicePackages, eq(orders.serviceId, servicePackages.id))
      .orderBy(desc(orders.createdAt))
      .limit(10);

    // Get recent activities
    const recentActivities = await db.select({
      id: activities.id,
      event: activities.event,
      entity: activities.entity,
      entityId: activities.entityId,
      metadata: activities.metadata,
      createdAt: activities.createdAt,
      userEmail: users.email,
    })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(20);

    const dashboardData = {
      stats: {
        totalOrders: totalOrdersResult.count,
        paidOrders: paidOrdersResult.count,
        pendingOrders: pendingOrdersResult.count,
        totalRevenue: revenueResult.total || 0,
      },
      recentOrders,
      recentActivities,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Update order status
router.patch('/admin/orders/:id/status', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [order] = await db.select().from(orders).where(eq(orders.id, parseInt(id))).limit(1);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [updatedOrder] = await db.update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    // Log activity
    await db.insert(activities).values({
      userId: req.user!.id,
      event: 'ADMIN_ORDER_STATUS_UPDATE',
      entity: 'order',
      entityId: updatedOrder.id.toString(),
      metadata: {
        oldStatus: order.status,
        newStatus: status,
        adminId: req.user!.id
      }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get all payments
router.get('/admin/payments', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const allPayments = await db.select({
      id: payments.id,
      orderId: payments.orderId,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      transactionId: payments.transactionId,
      status: payments.status,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
    })
      .from(payments)
      .orderBy(desc(payments.createdAt));

    res.json(allPayments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

// Get payment analytics
router.get('/admin/analytics/payments', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const [totalPaymentsResult] = await db.select({ count: count() }).from(payments);
    const [successfulPaymentsResult] = await db.select({ count: count() })
      .from(payments).where(eq(payments.status, 'completed'));
    const [pendingPaymentsResult] = await db.select({ count: count() })
      .from(payments).where(eq(payments.status, 'pending'));
    const [failedPaymentsResult] = await db.select({ count: count() })
      .from(payments).where(eq(payments.status, 'failed'));

    const [totalRevenueResult] = await db.select({ 
      total: sum(payments.amount) 
    }).from(payments).where(eq(payments.status, 'completed'));

    const analytics = {
      totalPayments: totalPaymentsResult.count,
      successfulPayments: successfulPaymentsResult.count,
      pendingPayments: pendingPaymentsResult.count,
      failedPayments: failedPaymentsResult.count,
      totalRevenue: totalRevenueResult.total || 0,
      successRate: totalPaymentsResult.count > 0 
        ? (successfulPaymentsResult.count / totalPaymentsResult.count * 100).toFixed(2) 
        : '0',
    };

    res.json(analytics);
  } catch (error) {
    console.error('Payment analytics error:', error);
    res.status(500).json({ error: 'Failed to get payment analytics' });
  }
});

// Get payment details
router.get('/admin/payments/:id', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const [payment] = await db.select().from(payments).where(eq(payments.id, parseInt(id))).limit(1);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Failed to get payment details' });
  }
});

// Get all orders for admin
router.get('/admin/orders', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const allOrders = await db.select({
      id: orders.id,
      userId: orders.userId,
      serviceId: orders.serviceId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      orderData: orders.orderData,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      userEmail: users.email,
      serviceName: servicePackages.name,
    })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(servicePackages, eq(orders.serviceId, servicePackages.id))
      .orderBy(desc(orders.createdAt));

    res.json(allOrders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get all activities for admin
router.get('/admin/activities', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const allActivities = await db.select({
      id: activities.id,
      userId: activities.userId,
      event: activities.event,
      entity: activities.entity,
      entityId: activities.entityId,
      metadata: activities.metadata,
      createdAt: activities.createdAt,
      userEmail: users.email,
    })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(100);

    res.json(allActivities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

// Create manual payment (admin only)
router.post('/admin/payments/manual', requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { orderId, amount, currency = 'SAR', paymentMethod = 'manual', notes } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Check if order exists
    const [order] = await db.select().from(orders).where(eq(orders.id, parseInt(orderId))).limit(1);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Generate manual transaction ID
    const transactionId = `manual_${orderId}_${Date.now()}`;

    // Create payment record
    const [payment] = await db.insert(payments).values({
      orderId: parseInt(orderId),
      amount: amount.toString(),
      currency,
      paymentMethod,
      transactionId,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    // Update order status to paid
    const [updatedOrder] = await db.update(orders)
      .set({
        status: 'PAID',
        paymentStatus: 'paid',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(orderId)))
      .returning();

    // Log activity
    await db.insert(activities).values({
      userId: req.user!.id,
      event: 'ADMIN_MANUAL_PAYMENT_CREATED',
      entity: 'payment',
      entityId: payment.id.toString(),
      metadata: {
        orderId,
        amount,
        currency,
        paymentMethod,
        transactionId,
        notes,
        adminId: req.user!.id,
        adminEmail: req.user!.email
      }
    });

    res.json({ 
      payment,
      updatedOrder,
      message: 'Manual payment created successfully'
    });
  } catch (error) {
    console.error('Create manual payment error:', error);
    res.status(500).json({ error: 'Failed to create manual payment' });
  }
});

export default router;
