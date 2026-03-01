import { Router } from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { db } from "../db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth";

export const systemRouter = Router();

// Interfaces
interface SystemHealth {
    status: "OPERATIONAL" | "DEGRADED" | "DOWN";
    uptime_seconds: number;
    ai_memory_size_mb: string;
    database_latency_ms: number;
    server_ram_usage_percent: string;
    cpu_load_avg: number[];
    timestamp: string;
}

// Helper: Execute shell commands safely
const runCommand = (cmd: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout) => {
            if (error) reject(error);
            else resolve(stdout.trim());
        });
    });
};

// Helper: Calculate AI Vector Database directory size
const getDirSize = (dirPath: string): number => {
    let size = 0;
    try {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                if (stats.isFile()) size += stats.size;
            }
        }
    } catch (e) {
        console.warn("Could not read directory size:", e);
    }
    return size / (1024 * 1024); // Convert to MB
};

// God Mode Health Endpoint
systemRouter.get("/health", requireAdmin, async (req, res) => {
    try {
        // 1. Calculate AI Memory Bank Size
        const memoryPath = path.join(process.cwd(), "ai-memory-bank");
        const memorySizeMB = getDirSize(memoryPath).toFixed(2);

        // 2. Neon Database Latency Ping (or SQLite fallback)
        let dbLatency = 0;
        try {
            const dbStart = Date.now();
            if (db) {
                await db.execute(sql`SELECT 1`);
            } else {
                // SQLite fallback - just check if file exists
                const sqlitePath = path.join(process.cwd(), "data/techpartner.db");
                fs.accessSync(sqlitePath);
            }
            dbLatency = Date.now() - dbStart;
        } catch (dbError) {
            console.warn("Database ping failed:", dbError);
            dbLatency = -1; // Indicate database issue
        }

        // 3. Hardware Metrics
        const totalRam = os.totalmem();
        const freeRam = os.freemem();
        const usedRamPercent = (((totalRam - freeRam) / totalRam) * 100).toFixed(1);
        const cpuLoad = os.loadavg();

        // 4. Determine Overall Status
        let currentStatus: "OPERATIONAL" | "DEGRADED" | "DOWN" = "OPERATIONAL";
        if (dbLatency > 500 || Number(usedRamPercent) > 90) {
            currentStatus = "DEGRADED";
        }
        if (dbLatency === -1) {
            currentStatus = "DOWN";
        }

        const healthData: SystemHealth = {
            status: currentStatus,
            uptime_seconds: process.uptime(),
            ai_memory_size_mb: memorySizeMB,
            database_latency_ms: dbLatency,
            server_ram_usage_percent: usedRamPercent,
            cpu_load_avg: cpuLoad,
            timestamp: new Date().toISOString()
        };

        res.status(200).json(healthData);

    } catch (error) {
        console.error("CRITICAL: System Check Failed:", error);
        res.status(500).json({ 
            status: "DOWN", 
            error: "A core sub-system is failing.",
            timestamp: new Date().toISOString()
        });
    }
});

// CRM Stats Endpoint (for admin dashboard)
systemRouter.get("/crm-stats", requireAdmin, async (req, res) => {
    try {
        // Import CRM functions dynamically to avoid circular dependencies
        const { getCRMStats, getAllLeads } = await import("../db/crm");
        
        const stats = await getCRMStats();
        const recentLeads = await getAllLeads();
        
        // Get last 5 leads with summaries
        const recentActivity = recentLeads.slice(0, 5).map(lead => ({
            email: lead.email,
            name: lead.name,
            score: lead.leadScore,
            summary: lead.latestSummary,
            createdAt: lead.createdAt
        }));

        res.json({
            stats,
            recentActivity,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("CRM Stats Error:", error);
        res.status(500).json({ 
            error: "Failed to fetch CRM stats",
            timestamp: new Date().toISOString()
        });
    }
});

// AI Memory Stats Endpoint
systemRouter.get("/ai-memory", requireAdmin, async (req, res) => {
    try {
        const memoryPath = path.join(process.cwd(), "ai-memory-bank");
        let memoryStats = {
            totalMemories: 0,
            fileSizeMB: "0.00",
            lastUpdated: null as string | null
        };

        if (fs.existsSync(memoryPath)) {
            const files = fs.readdirSync(memoryPath);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            
            let totalSize = 0;
            let latestMtime: Date | null = null;

            for (const file of jsonFiles) {
                const filePath = path.join(memoryPath, file);
                const stats = fs.statSync(filePath);
                totalSize += stats.size;
                
                if (!latestMtime || stats.mtime > latestMtime) {
                    latestMtime = stats.mtime;
                }
            }

            // Count total memories across all files
            let totalMemories = 0;
            for (const file of jsonFiles) {
                try {
                    const content = fs.readFileSync(path.join(memoryPath, file), 'utf-8');
                    const data = JSON.parse(content);
                    if (Array.isArray(data)) {
                        totalMemories += data.length;
                    }
                } catch (e) {
                    // Skip corrupted files
                }
            }

            memoryStats = {
                totalMemories,
                fileSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
                lastUpdated: latestMtime ? latestMtime.toISOString() : null
            };
        }

        res.json(memoryStats);
    } catch (error) {
        console.error("AI Memory Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch AI memory stats" });
    }
});
