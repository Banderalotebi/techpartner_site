import { Router } from 'express';
import { db } from '../db';
import { orders, payments, activities, users, servicePackages } from '../../shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// Create order
router.post('/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { serviceId, orderData } = req.body;
    const userId = req.user!.id;

    const [order] = await db.insert(orders).values({
      userId,
      serviceId,
      orderData,
      totalAmount: orderData.totalAmount || '0',
      status: 'pending',
      paymentStatus: 'pending',
    }).returning();

    // Log activity
    await db.insert(activities).values({
      userId,
      event: 'ORDER_CREATED',
      entity: 'order',
      entityId: order.id.toString(),
      metadata: { serviceId, orderData }
    });

    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Save draft order
router.post('/orders/draft', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { serviceId, orderData } = req.body;
    const userId = req.user!.id;

    // Check for existing draft
    const existingDraft = await db.select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        eq(orders.serviceId, serviceId),
        eq(orders.status, 'draft')
      ))
      .limit(1);

    let order;
    if (existingDraft.length > 0) {
      // Update existing draft
      [order] = await db.update(orders)
        .set({
          orderData,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, existingDraft[0].id))
        .returning();
    } else {
      // Create new draft
      [order] = await db.insert(orders).values({
        userId,
        serviceId,
        orderData,
        totalAmount: orderData.totalAmount || '0',
        status: 'draft',
        paymentStatus: 'pending',
      }).returning();
    }

    res.json(order);
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

// Get draft order
router.get('/orders/draft/:serviceId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { serviceId } = req.params;
    const userId = req.user!.id;

    const draft = await db.select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        eq(orders.serviceId, parseInt(serviceId)),
        eq(orders.status, 'draft')
      ))
      .limit(1);

    if (draft.length === 0) {
      return res.status(404).json({ error: 'No draft found' });
    }

    res.json(draft[0]);
  } catch (error) {
    console.error('Get draft error:', error);
    res.status(500).json({ error: 'Failed to get draft' });
  }
});

// Confirm order
router.post('/orders/:id/confirm', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [order] = await db.update(orders)
      .set({
        status: 'confirmed',
        updatedAt: new Date(),
      })
      .where(and(
        eq(orders.id, parseInt(id)),
        eq(orders.userId, userId)
      ))
      .returning();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Log activity
    await db.insert(activities).values({
      userId,
      event: 'ORDER_CONFIRMED',
      entity: 'order',
      entityId: order.id.toString(),
      metadata: { orderId: order.id }
    });

    res.json(order);
  } catch (error) {
    console.error('Confirm order error:', error);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

// Get user orders
router.get('/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    const userOrders = await db.select({
      id: orders.id,
      serviceId: orders.serviceId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentStatus: orders.paymentStatus,
      orderData: orders.orderData,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    res.json(userOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get all orders (admin)
router.get('/orders/all', requireAuth, async (req: AuthRequest, res) => {
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
    })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    res.json(allOrders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get single order
router.get('/orders/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const [order] = await db.select({
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
      .where(and(
        eq(orders.id, parseInt(id)),
        eq(orders.userId, userId)
      ))
      .limit(1);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update order status (admin)
router.patch('/orders/:id/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [order] = await db.update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Log activity
    await db.insert(activities).values({
      userId: req.user!.id,
      event: 'ORDER_STATUS_UPDATED',
      entity: 'order',
      entityId: order.id.toString(),
      metadata: { newStatus: status, orderId: order.id }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
