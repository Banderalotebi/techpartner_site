// server/routes/reports.ts - Advanced Reporting & Export (Phase 4)
import { Router } from "express";
import {
  getCRMStats,
  getAllLeads,
  getInteractionsByLead,
  getLeadsByScore,
  exportLeadsToCSV
} from "../db/crm";
import { requireAdmin, simpleAuth } from "../middleware/auth";
import Database from 'better-sqlite3';

// Type definition for Lead
interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  lead_score: string;
  created_at: string;
  updated_at: string;
}

export const reportsRouter = Router();

// Initialize SEO database connection for reports
const seoDb = new Database('seo-prospects.db');

// Get comprehensive CRM report
reportsRouter.get("/crm", simpleAuth, async (req, res) => {
    try {
        const stats = getCRMStats();
        const leads = getAllLeads();
        // Get interactions for all leads (limited to recent 50)
        const recentInteractions: any[] = [];
        for (const lead of (leads as Lead[]).slice(0, 20)) {
            const interactions = getInteractionsByLead(lead.email);
            recentInteractions.push(...interactions);
        }
        recentInteractions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        res.json({
            summary: stats,
            leads: leads.slice(0, 100), // Limit to prevent huge payloads
            recentActivity: recentInteractions,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("CRM Report Error:", error);
        res.status(500).json({ error: "Failed to generate CRM report." });
    }
});

// Export CRM leads to CSV
reportsRouter.get("/export/crm/csv", simpleAuth, async (req, res) => {
    try {
        const csvContent = exportLeadsToCSV();
        
        if (!csvContent) {
            return res.status(404).json({ error: "No leads to export." });
        }

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=crm_leads_${new Date().toISOString().split('T')[0]}.csv`);
        
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("CSV Export Error:", error);
        res.status(500).json({ error: "Failed to generate CSV." });
    }
});

// Get SEO performance report
reportsRouter.get("/seo", simpleAuth, async (req, res) => {
    try {
        // Get SEO prospects data
        const prospects = seoDb.prepare('SELECT * FROM prospects ORDER BY created_at DESC').all();
        
        // Calculate SEO metrics
        const totalProspects = prospects.length;
        const approvedProspects = (prospects as any[]).filter(p => p.approved).length;
        const pendingProspects = totalProspects - approvedProspects;
        
        // Group by date
        const byDate = (prospects as any[]).reduce((acc: any, p: any) => {
            const date = new Date(p.created_at).toISOString().split('T')[0];
            if (!acc[date]) acc[date] = { total: 0, approved: 0 };
            acc[date].total++;
            if (p.approved) acc[date].approved++;
            return acc;
        }, {});

        res.json({
            summary: {
                totalProspects,
                approvedProspects,
                pendingProspects,
                approvalRate: totalProspects > 0 ? ((approvedProspects / totalProspects) * 100).toFixed(1) : 0
            },
            prospects: prospects.slice(0, 100),
            timeline: byDate,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("SEO Report Error:", error);
        res.status(500).json({ error: "Failed to generate SEO report." });
    }
});

// Get combined AI Sales & SEO report
reportsRouter.get("/unified", simpleAuth, async (req, res) => {
    try {
        const crmStats = getCRMStats();
        const prospects = seoDb.prepare('SELECT * FROM prospects ORDER BY created_at DESC').all();
        
        const report = {
            aiSales: {
                ...crmStats,
                hotLeadsPercentage: crmStats.total > 0 
                    ? ((crmStats.hot / crmStats.total) * 100).toFixed(1) 
                    : 0
            },
            seo: {
                totalProspects: prospects.length,
                approvedProspects: (prospects as any[]).filter(p => p.approved).length
            },
            systemHealth: {
                crmDatabase: 'connected',
                seoDatabase: 'connected',
                timestamp: new Date().toISOString()
            }
        };

        res.json(report);
    } catch (error) {
        console.error("Unified Report Error:", error);
        res.status(500).json({ error: "Failed to generate unified report." });
    }
});

// Export full system report as JSON
reportsRouter.get("/export/full", simpleAuth, async (req, res) => {
    try {
        const crmStats = getCRMStats();
        const allLeads = getAllLeads();
        // Collect all interactions
        const allInteractions: any[] = [];
        for (const lead of allLeads as Lead[]) {
            const interactions = getInteractionsByLead(lead.email);
            allInteractions.push(...interactions);
        }
        const prospects = seoDb.prepare('SELECT * FROM prospects ORDER BY created_at DESC').all();

        const fullReport = {
            generatedAt: new Date().toISOString(),
            crm: {
                stats: crmStats,
                leads: allLeads,
                interactions: allInteractions
            },
            seo: {
                prospects: prospects
            },
            metadata: {
                version: "1.0.0",
                system: "TechPartner AI OS",
                exportType: "full"
            }
        };

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Disposition", `attachment; filename=techpartner_report_${new Date().toISOString().split('T')[0]}.json`);
        
        res.json(fullReport);
    } catch (error) {
        console.error("Full Export Error:", error);
        res.status(500).json({ error: "Failed to generate full report." });
    }
});

// Get real-time dashboard metrics
reportsRouter.get("/dashboard", simpleAuth, async (req, res) => {
    try {
        const crmStats = getCRMStats();
        
        // Get today's leads
        const today = new Date().toISOString().split('T')[0];
        const todayLeads = (getAllLeads() as any[]).filter(
            (l: any) => l.created_at && l.created_at.startsWith(today)
        ).length;

        // Get recent hot leads
        const hotLeads = (getLeadsByScore('HOT') as any[]).slice(0, 5);

        res.json({
            metrics: {
                totalLeads: crmStats.total,
                todayLeads,
                hotLeads: crmStats.hot,
                warmLeads: crmStats.warm,
                coldLeads: crmStats.cold,
                pendingLeads: crmStats.pending
            },
            recentHotLeads: hotLeads,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Dashboard Metrics Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard metrics." });
    }
});
