import { Router } from 'express';
import { prisma } from '../prisma-client';
import { requireAuth, requireAdmin, type AuthRequest } from '../middleware/auth';

const router = Router();

// Create order (authenticated users)
router.post('/orders', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { service, details, amount } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        email: req.user!.email,
        service,
        details: JSON.stringify(details),
        amount,
        status: 'PENDING'
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: req.user!.id,
        event: 'ORDER_CREATED',
        metadata: JSON.stringify({ orderId: order.id, service, amount })
      }
    });

    res.json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Save order progress (draft)
router.post('/orders/draft', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { servicePackageId, formData, step, selections } = req.body;

    // Check if user already has a draft for this service
    const existingDraft = await prisma.order.findFirst({
      where: {
        userId: req.user!.id,
        status: 'DRAFT',
        service: servicePackageId?.toString()
      }
    });

    const progressData = {
      formData,
      step,
      selections,
      timestamp: new Date().toISOString()
    };

    let order;
    if (existingDraft) {
      // Update existing draft
      order = await prisma.order.update({
        where: { id: existingDraft.id },
        data: {
          details: JSON.stringify(progressData)
        }
      });
    } else {
      // Create new draft
      order = await prisma.order.create({
        data: {
          userId: req.user!.id,
          email: req.user!.email,
          service: servicePackageId?.toString() || 'logo-design',
          details: JSON.stringify(progressData),
          amount: 0, // Will be updated when order is completed
          status: 'DRAFT'
        }
      });
    }

    res.json({ draftId: order.id, status: 'saved' });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get order progress (draft)
router.get('/orders/draft/:servicePackageId?', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { servicePackageId } = req.params;

    const draft = await prisma.order.findFirst({
      where: {
        userId: req.user!.id,
        status: 'DRAFT',
        ...(servicePackageId && { service: servicePackageId })
      },
      orderBy: { updatedAt: 'desc' }
    });

    if (!draft) {
      return res.json({ progress: null });
    }

    const progress = JSON.parse(draft.details || '{}');
    res.json({ 
      progress: {
        ...progress,
        draftId: draft.id,
        service: draft.service
      }
    });
  } catch (error) {
    console.error('Get draft error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Convert draft to pending order
router.post('/orders/submit', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { draftId, finalData, amount } = req.body;

    const order = await prisma.order.update({
      where: { 
        id: draftId,
        userId: req.user!.id,
        status: 'DRAFT'
      },
      data: {
        details: JSON.stringify(finalData),
        amount,
        status: 'PENDING'
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: req.user!.id,
        event: 'ORDER_SUBMITTED',
        metadata: JSON.stringify({ orderId: order.id, amount })
      }
    });

    res.json({ orderId: order.id, status: order.status });
  } catch (error) {
    console.error('Submit order error:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
});

// Get user's orders
router.get('/orders/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get all orders (admin only)
router.get('/admin/orders', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get specific order
router.get('/orders/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user!.id && !req.user!.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Update order status (admin only)
router.put('/admin/orders/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, tapId, paidAt } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        tapId: tapId || undefined,
        paidAt: paidAt ? new Date(paidAt) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Log activity
    await prisma.activity.create({
      data: {
        userId: req.user!.id,
        event: 'ORDER_STATUS_UPDATED',
        metadata: JSON.stringify({ orderId: id, status, updatedBy: req.user!.email })
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Get order statistics for user
router.get('/orders/stats', requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Get order counts by status
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true
      }
    });

    // Get total amount spent
    const totalSpent = await prisma.order.aggregate({
      where: { 
        userId,
        status: 'PAID'
      },
      _sum: {
        amount: true
      }
    });

    // Format the response
    const stats = {
      total: 0,
      pending: 0,
      paid: 0,
      failed: 0,
      cancelled: 0,
      totalSpent: totalSpent._sum.amount ? totalSpent._sum.amount / 100 : 0
    };

    orderStats.forEach((stat: any) => {
      stats.total += stat._count.status;
      switch (stat.status.toLowerCase()) {
        case 'pending':
          stats.pending = stat._count.status;
          break;
        case 'paid':
          stats.paid = stat._count.status;
          break;
        case 'failed':
          stats.failed = stat._count.status;
          break;
        case 'cancelled':
          stats.cancelled = stat._count.status;
          break;
      }
    });

    res.json(stats);
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Failed to fetch order statistics' });
  }
});

export default router;
