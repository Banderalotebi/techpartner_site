import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface OrderWithUser {
  id: string;
  amount: number | null;
  status: string;
  service: string;
  createdAt: Date;
  paidAt: Date | null;
  tapId: string | null;
  user?: {
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  email: string;
}

export async function generateReceipt(order: OrderWithUser, outputPath: string): Promise<void> {
  // Ensure the directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(outputPath));

  // Header
  doc.fontSize(24).text('TechPartner Platform', { align: 'center' });
  doc.fontSize(16).text('Payment Receipt', { align: 'center' });
  doc.moveDown(2);

  // Receipt details
  doc.fontSize(12)
    .text(`Receipt #: ${order.id}`, 50, doc.y)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, doc.y - 12);

  doc.moveDown();

  // Customer information
  doc.text('Customer Information:', { underline: true });
  const customerName = order.user?.firstName && order.user?.lastName 
    ? `${order.user.firstName} ${order.user.lastName}` 
    : 'N/A';
  doc.text(`Name: ${customerName}`);
  doc.text(`Email: ${order.user?.email || order.email}`);
  
  doc.moveDown();

  // Service details
  doc.text('Service Details:', { underline: true });
  doc.text(`Service: ${order.service}`);
  doc.text(`Amount: ${order.amount ? (order.amount / 100).toFixed(2) : '0.00'} SAR`);
  doc.text(`Status: ${order.status}`);
  
  if (order.paidAt) {
    doc.text(`Paid At: ${new Date(order.paidAt).toLocaleString()}`);
  }
  
  if (order.tapId) {
    doc.text(`Transaction ID: ${order.tapId}`);
  }

  doc.moveDown(2);

  // Footer
  doc.fontSize(10)
    .text('Thank you for choosing TechPartner Platform!', { align: 'center' })
    .text('For support, contact us at support@techpartner.com', { align: 'center' });

  // Add a border
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke();

  doc.end();
}
