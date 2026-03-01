// server/routes/reports-pdf.ts - PDF Export functionality for Phase 4
import { Router } from "express";
import {
  getCRMStats,
  getAllLeads,
  getInteractionsByLead,
} from "../db/crm";
import { db } from "../db";
import { prospects } from "../../shared/schema";
import { desc } from "drizzle-orm";
import { simpleAuth } from "../middleware/auth";

export const pdfReportsRouter = Router();

// Generate PDF report (HTML-based for simplicity, can be converted to PDF via puppeteer)
pdfReportsRouter.get("/crm/pdf", simpleAuth, async (req, res) => {
    try {
        const stats = await getCRMStats();
        const leads = await getAllLeads();
        
        // Generate HTML report
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TechPartner CRM Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #01A1C1; border-bottom: 3px solid #01A1C1; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #01A1C1; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
        .hot { background: #fef2f2; color: #dc2626; }
        .warm { background: #fefce8; color: #ca8a04; }
        .cold { background: #eff6ff; color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #01A1C1; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <h1>🤖 TechPartner AI CRM Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    
    <h2>Lead Statistics</h2>
    <div class="stats-grid">
        <div class="stat-box">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total Leads</div>
        </div>
        <div class="stat-box hot">
            <div class="stat-number">${stats.hot}</div>
            <div class="stat-label">🔥 HOT</div>
        </div>
        <div class="stat-box warm">
            <div class="stat-number">${stats.warm}</div>
            <div class="stat-label">🌡️ WARM</div>
        </div>
        <div class="stat-box cold">
            <div class="stat-number">${stats.cold}</div>
            <div class="stat-label">❄️ COLD</div>
        </div>
        <div class="stat-box">
            <div class="stat-number">${stats.pending}</div>
            <div class="stat-label">⏳ PENDING</div>
        </div>
    </div>

    <h2>Lead Details</h2>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Score</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            ${leads.map((lead: any) => `
            <tr>
                <td>${lead.name || 'Unknown'}</td>
                <td>${lead.email}</td>
                <td>${lead.source}</td>
                <td><strong>${lead.leadScore}</strong></td>
                <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>TechPartner AI Operating System • Autonomous CRM Report</p>
        <p>This report was generated automatically by the AI Sales Closer system.</p>
    </div>
</body>
</html>`;

        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", `attachment; filename=crm_report_${new Date().toISOString().split('T')[0]}.html`);
        
        res.send(html);
    } catch (error) {
        console.error("PDF Report Error:", error);
        res.status(500).json({ error: "Failed to generate PDF report." });
    }
});

// Generate unified system report as HTML/PDF
pdfReportsRouter.get("/unified/pdf", simpleAuth, async (req, res) => {
    try {
        const crmStats = await getCRMStats();
        const allLeads = await getAllLeads();
        const allProspects = await db
            .select()
            .from(prospects)
            .orderBy(desc(prospects.createdAt));

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TechPartner Unified System Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #01A1C1; border-bottom: 3px solid #01A1C1; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; border-left: 4px solid #01A1C1; padding-left: 15px; }
        .header { background: linear-gradient(135deg, #01A1C1 0%, #0284a3 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .header h1 { color: white; border: none; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid transparent; }
        .stat-box:hover { border-color: #01A1C1; }
        .stat-number { font-size: 36px; font-weight: bold; color: #01A1C1; }
        .stat-label { font-size: 12px; color: #666; text-transform: uppercase; margin-top: 5px; }
        .section { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-hot { background: #fef2f2; color: #dc2626; }
        .badge-warm { background: #fefce8; color: #ca8a04; }
        .badge-cold { background: #eff6ff; color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        th { background: #01A1C1; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        tr:hover { background: #f9f9f9; }
        .footer { margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center; font-size: 12px; color: #666; }
        .system-status { display: flex; gap: 20px; margin: 20px 0; }
        .status-item { flex: 1; background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #86efac; }
        .status-item.warning { background: #fefce8; border-color: #fde047; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 TechPartner AI Operating System</h1>
        <p>Unified System Report • ${new Date().toLocaleString()}</p>
    </div>

    <div class="section">
        <h2>🤖 AI Sales Performance</h2>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">${crmStats.total}</div>
                <div class="stat-label">Total Leads</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${crmStats.hot}</div>
                <div class="stat-label">🔥 HOT Leads</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${crmStats.warm}</div>
                <div class="stat-label">🌡️ WARM Leads</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${crmStats.cold}</div>
                <div class="stat-label">❄️ COLD Leads</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${crmStats.pending}</div>
                <div class="stat-label">⏳ Pending</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${crmStats.total > 0 ? ((crmStats.hot / crmStats.total) * 100).toFixed(1) : 0}%</div>
                <div class="stat-label">Conversion Rate</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>🔍 SEO Prospecting</h2>
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-number">${allProspects.length}</div>
                <div class="stat-label">Total Prospects</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${allProspects.filter(p => p.approved).length}</div>
                <div class="stat-label">✅ Approved</div>
            </div>
            <div class="stat-box">
                <div class="stat-number">${allProspects.filter(p => !p.approved).length}</div>
                <div class="stat-label">⏳ Pending Review</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📊 Recent HOT Leads (Action Required)</h2>
        <table>
            <thead>
                <tr>
                    <th>Lead</th>
                    <th>Email</th>
                    <th>Source</th>
                    <th>Score</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${allLeads.filter((l: any) => l.leadScore === 'HOT').slice(0, 10).map((lead: any) => `
                <tr>
                    <td><strong>${lead.name || 'Unknown'}</strong></td>
                    <td>${lead.email}</td>
                    <td>${lead.source}</td>
                    <td><span class="badge badge-hot">🔥 HOT</span></td>
                    <td>${new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
                `).join('') || '<tr><td colspan="5" style="text-align:center;color:#999;">No HOT leads yet</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>🎯 SEO Prospects (Recent)</h2>
        <table>
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${allProspects.slice(0, 10).map((prospect: any) => `
                <tr>
                    <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${prospect.url}</td>
                    <td><span class="badge ${prospect.approved ? 'badge-hot' : 'badge-cold'}">${prospect.approved ? '✅ Approved' : '⏳ Pending'}</span></td>
                    <td>${prospect.reason || 'N/A'}</td>
                    <td>${new Date(prospect.createdAt).toLocaleDateString()}</td>
                </tr>
                `).join('') || '<tr><td colspan="4" style="text-align:center;color:#999;">No prospects yet</td></tr>'}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p><strong>TechPartner AI Operating System v1.0</strong></p>
        <p>Autonomous CRM + SEO + Content Generation Platform</p>
        <p>Report generated: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;

        res.setHeader("Content-Type", "text/html");
        res.setHeader("Content-Disposition", `attachment; filename=techpartner_unified_report_${new Date().toISOString().split('T')[0]}.html`);
        
        res.send(html);
    } catch (error) {
        console.error("Unified PDF Report Error:", error);
        res.status(500).json({ error: "Failed to generate unified report." });
    }
});
