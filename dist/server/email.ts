import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;
  private isDevelopment: boolean;

  constructor() {
    // Default to development configuration
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@techpartner.sa';
    this.isDevelopment = process.env.NODE_ENV === 'development';
    
    // Only configure transporter if we have credentials or are in production
    if (this.shouldCreateTransporter()) {
      const config: EmailConfig = this.getEmailConfig();
      this.transporter = nodemailer.createTransport(config);
    }
  }

  private shouldCreateTransporter(): boolean {
    if (process.env.NODE_ENV === 'production') {
      return true; // Always try to create in production
    }
    
    // In development, only create if we have SMTP credentials
    return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  }

  private getEmailConfig(): EmailConfig {
    if (process.env.NODE_ENV === 'production') {
      // Production: Use Zoho SMTP for techpartner.sa domain
      return {
        host: 'smtp.zoho.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
          user: process.env.SMTP_USER || 'noreply@techpartner.sa',
          pass: process.env.SMTP_PASS || '',
        },
      };
    } else {
      // Development: Use Gmail SMTP for testing (you can replace with your own Gmail app password)
      // Or use a service like Mailtrap for development
      return {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      };
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      // If no transporter (development without credentials), just log the email
      if (!this.transporter) {
        console.log('\n=== EMAIL SIMULATION (Development Mode) ===');
        console.log('From:', this.fromEmail);
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('Content:', options.html || options.text);
        console.log('==========================================\n');
        return true;
      }

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName?: string): Promise<boolean> {
    const subject = 'Welcome to TechPartner!';
    const html = `
      <h2>Welcome to TechPartner!</h2>
      <p>Hello ${userName || 'there'},</p>
      <p>Thank you for joining TechPartner. We're excited to help you with your digital transformation journey.</p>
      <p>If you have any questions, feel free to reach out to us at info@techpartner.sa</p>
      <p>Best regards,<br>The TechPartner Team</p>
    `;
    
    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendContactFormEmail(formData: any): Promise<boolean> {
    const subject = `New Contact Form Submission - ${formData.company || 'Unknown Company'}`;
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.contactPerson || 'Not provided'}</p>
      <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
      <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${formData.phoneNumber || 'Not provided'}</p>
      <p><strong>Industry:</strong> ${formData.industry || 'Not provided'}</p>
      <p><strong>Service:</strong> ${formData.serviceType || 'Not provided'}</p>
      <p><strong>Budget:</strong> ${formData.budget || 'Not provided'}</p>
      <p><strong>Timeline:</strong> ${formData.timeline || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.projectDescription || 'No message provided'}</p>
    `;
    
    // Send to the business email instead of a test email
    return this.sendEmail({
      to: 'info@techpartner.sa',
      subject,
      html,
    });
  }

  async testEmailConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.log('Email service is in development mode (no SMTP credentials)');
        return true; // Consider it "working" in dev mode
      }
      
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
