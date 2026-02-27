import { Router } from 'express';
import { emailService } from '../email';

const router = Router();

// Test email endpoint (for development only)
router.post('/test-email', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint not available in production' });
  }

  try {
    const { to, subject, message } = req.body;
    
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, message' 
      });
    }

    const success = await emailService.sendEmail({
      to,
      subject,
      html: `<p>${message}</p>`,
      text: message
    });

    if (success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, message: 'Error sending test email' });
  }
});

// Test email connection
router.get('/test-email-connection', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint not available in production' });
  }

  try {
    const isConnected = await emailService.testEmailConnection();
    
    if (isConnected) {
      res.json({ success: true, message: 'Email service is connected' });
    } else {
      res.status(500).json({ success: false, message: 'Email service connection failed' });
    }
  } catch (error) {
    console.error('Email connection test error:', error);
    res.status(500).json({ success: false, message: 'Error testing email connection' });
  }
});

export default router;
