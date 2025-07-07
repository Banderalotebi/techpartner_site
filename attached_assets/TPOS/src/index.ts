// === FILE: src/index.ts ===
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';
import orderRoutes from './routes/order.routes';
import serviceRoutes from './routes/service.routes';
import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import paymentRoutes from './routes/payment.routes';
import notificationRoutes from './routes/notification.routes';
import analyticsRoutes from './routes/analytics.routes';
import contractRoutes from './routes/contract.routes';
import roleRoutes from './routes/role.routes';
import documentRoutes from './routes/document.routes';
import auditRoutes from './routes/audit.routes';
import externalAccessRoutes from './routes/externalAccess.routes';
import cronRoutes from './routes/cron.routes';
import impersonationRoutes from './routes/impersonation.routes';
import referralRoutes from './routes/referral.routes';
import inviteRoutes from './routes/invite.routes';
import supportRoutes from './routes/support.routes';
import fraudRoutes from './routes/fraud.routes';
import deeplinkRoutes from './routes/deeplink.routes';
import commissionRoutes from './routes/commission.routes';
import transparencyRoutes from './routes/transparency.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/external-access', externalAccessRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/impersonation', impersonationRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/deeplinks', deeplinkRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/transparency', transparencyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TPOS API is running 🚀 on port ${PORT}`));
