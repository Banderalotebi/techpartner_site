import { Router } from 'express';
import { db } from '../db';
import { inquiries, insertInquirySchema } from '../../shared/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { z } from 'zod';
import { emailService } from '../email';

const router = Router();

// Validation schema for inquiry form (using the shared schema)
const inquirySubmissionSchema = insertInquirySchema.extend({
  email: z.string().email().optional().or(z.literal(''))
});

// Submit inquiry form
router.post('/submit-inquiry', async (req, res) => {
  try {
    // Validate request data
    const validatedData = inquirySubmissionSchema.parse(req.body);

    // Clean up email field (convert empty string to null)
    const cleanedData = {
      ...validatedData,
      email: validatedData.email === '' ? null : validatedData.email
    };

    // Save to database
    const [inquiry] = await db.insert(inquiries).values(cleanedData).returning();

    console.log('New inquiry submitted:', {
      id: inquiry.id,
      fullName: inquiry.fullName,
      mobile: inquiry.mobile,
      projectType: inquiry.projectType,
      language: inquiry.language,
      createdAt: inquiry.createdAt
    });

    // Send email notification to the business
    try {
      const emailData = {
        contactPerson: inquiry.fullName,
        email: inquiry.email,
        company: inquiry.companyRole || 'Not provided',
        phoneNumber: inquiry.mobile,
        serviceType: inquiry.projectType,
        projectDescription: `Inquiry from ${inquiry.fullName} regarding ${inquiry.projectType}`,
        industry: 'Not specified',
        budget: 'Not specified',
        timeline: 'Not specified'
      };
      
      await emailService.sendContactFormEmail(emailData);
      console.log('Email notification sent for inquiry:', inquiry.id);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the inquiry submission if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiryId: inquiry.id
    });

  } catch (error) {
    console.error('Error submitting inquiry:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry'
    });
  }
});

// Get all inquiries (admin endpoint)
router.get('/inquiries', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Execute queries without complex filtering for now
    const [inquiryResults, totalResults] = await Promise.all([
      db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(Number(limit)).offset(skip),
      db.select({ count: count() }).from(inquiries)
    ]);

    const total = totalResults[0]?.count || 0;

    res.json({
      success: true,
      data: {
        inquiries: inquiryResults,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries'
    });
  }
});

// Get inquiry statistics
router.get('/inquiry-stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalInquiries,
      todayInquiries,
      languageStats,
      projectTypeStats
    ] = await Promise.all([
      // Total inquiries
      db.select({ count: count() }).from(inquiries),
      
      // Today's inquiries
      db.select({ count: count() }).from(inquiries).where(sql`${inquiries.createdAt} >= ${today}`),
      
      // Language breakdown
      db.select({
        language: inquiries.language,
        count: count()
      }).from(inquiries).groupBy(inquiries.language),
      
      // Project type breakdown
      db.select({
        projectType: inquiries.projectType,
        count: count()
      }).from(inquiries).groupBy(inquiries.projectType).orderBy(desc(count()))
    ]);

    res.json({
      success: true,
      data: {
        totalInquiries: totalInquiries[0]?.count || 0,
        todayInquiries: todayInquiries[0]?.count || 0,
        languageBreakdown: languageStats,
        projectTypeBreakdown: projectTypeStats
      }
    });

  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry statistics'
    });
  }
});

export default router;
