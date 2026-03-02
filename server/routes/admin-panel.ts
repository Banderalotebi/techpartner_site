// Admin Panel Management Routes
// Phase 4: Administrative Tools for Sovereign Executive Command Center

import { Router } from "express";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth";
import fs from "fs";
import path from "path";

export const adminPanelRouter = Router();

// ============================================
// PHASE 4A: USER CONSOLE
// ============================================

// Get all users with search
adminPanelRouter.get("/users", requireAdmin, async (req, res) => {
    try {
        const allUsers = await db.select().from(users);
        
        // Format for frontend
        const formattedUsers = allUsers.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
            lastLoginAt: u.lastLoginAt
        }));
        
        res.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Suspend/Activate user
adminPanelRouter.patch("/users/:id/status", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        const [updatedUser] = await db
            .update(users)
            .set({ isActive })
            .where(eq(users.id, parseInt(id)))
            .returning();
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Log the action
        console.log(`[ADMIN_ACTION] User ${updatedUser.email} ${isActive ? 'activated' : 'suspended'} by admin`);
        
        res.json({ 
            success: true, 
            message: `User ${isActive ? 'activated' : 'suspended'} successfully`,
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Failed to update user status" });
    }
});

// Elevate user to admin
adminPanelRouter.patch("/users/:id/role", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (!['admin', 'agent', 'client'].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        
        const [updatedUser] = await db
            .update(users)
            .set({ role })
            .where(eq(users.id, parseInt(id)))
            .returning();
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Log the action
        console.log(`[ADMIN_ACTION] User ${updatedUser.email} role changed to ${role} by admin`);
        
        res.json({ 
            success: true, 
            message: `User elevated to ${role} successfully`,
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "Failed to update user role" });
    }
});

// Reset user password
adminPanelRouter.post("/users/:id/reset-password", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
        
        // In production, you'd hash this properly
        // For now, we'll just return the temp password (admin must communicate it)
        // In a real app, you'd send an email with the reset link
        
        const [updatedUser] = await db
            .update(users)
            .set({ password: tempPassword }) // This should be hashed in production!
            .where(eq(users.id, parseInt(id)))
            .returning();
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Log the action
        console.log(`[ADMIN_ACTION] Password reset for ${updatedUser.email} by admin`);
        
        res.json({ 
            success: true, 
            message: "Password reset successfully",
            tempPassword // In production, send via email instead!
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Failed to reset password" });
    }
});

// ============================================
// PHASE 4B: AI CACHE PURGE
// ============================================

// Clear AI Vector Memory
adminPanelRouter.post("/cache/purge-memory", requireAdmin, async (req, res) => {
    try {
        const memoryPath = path.join(process.cwd(), "ai-memory-bank");
        
        if (fs.existsSync(memoryPath)) {
            const files = fs.readdirSync(memoryPath);
            let deletedCount = 0;
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    fs.unlinkSync(path.join(memoryPath, file));
                    deletedCount++;
                }
            }
            
            // Log the action
            console.log(`[ADMIN_ACTION] AI memory cache purged: ${deletedCount} files deleted by admin`);
            
            res.json({ 
                success: true, 
                message: `Cleared ${deletedCount} memory files`,
                filesDeleted: deletedCount
            });
        } else {
            res.json({ 
                success: true, 
                message: "No memory files to clear",
                filesDeleted: 0
            });
        }
    } catch (error) {
        console.error("Error purging cache:", error);
        res.status(500).json({ error: "Failed to purge cache" });
    }
});

// Get cache status
adminPanelRouter.get("/cache/status", requireAdmin, async (req, res) => {
    try {
        const memoryPath = path.join(process.cwd(), "ai-memory-bank");
        let cacheInfo = {
            memoryFiles: 0,
            totalSizeMB: "0.00",
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
            
            cacheInfo = {
                memoryFiles: jsonFiles.length,
                totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
                lastUpdated: latestMtime ? latestMtime.toISOString() : null
            };
        }
        
        res.json(cacheInfo);
    } catch (error) {
        console.error("Error getting cache status:", error);
        res.status(500).json({ error: "Failed to get cache status" });
    }
});

// ============================================
// PHASE 4C: EMERGENCY BANNER
// ============================================

// Get system announcement
adminPanelRouter.get("/announcement", requireAdmin, async (req, res) => {
    try {
        // In production, this would come from a database
        // For now, read from a file
        const announcementPath = path.join(process.cwd(), "data", "announcement.json");
        
        let announcement = null;
        if (fs.existsSync(announcementPath)) {
            announcement = JSON.parse(fs.readFileSync(announcementPath, 'utf-8'));
        }
        
        res.json(announcement || { active: false, message: "", type: "info" });
    } catch (error) {
        res.json({ active: false, message: "", type: "info" });
    }
});

// Set system announcement
adminPanelRouter.post("/announcement", requireAdmin, async (req, res) => {
    try {
        const { message, type } = req.body;
        
        // Validate
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        if (!['info', 'warning', 'critical'].includes(type)) {
            return res.status(400).json({ error: "Invalid announcement type" });
        }
        
        const announcement = {
            active: true,
            message: message.trim(),
            type,
            createdAt: new Date().toISOString()
        };
        
        // Save to file
        const dataDir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        const announcementPath = path.join(dataDir, "announcement.json");
        fs.writeFileSync(announcementPath, JSON.stringify(announcement, null, 2));
        
        // Log the action
        console.log(`[ADMIN_ACTION] System announcement set: ${type} - "${message.substring(0, 50)}..."`);
        
        res.json({ 
            success: true, 
            message: "Announcement published successfully",
            announcement
        });
    } catch (error) {
        console.error("Error setting announcement:", error);
        res.status(500).json({ error: "Failed to set announcement" });
    }
});

// Clear announcement
adminPanelRouter.delete("/announcement", requireAdmin, async (req, res) => {
    try {
        const announcementPath = path.join(process.cwd(), "data", "announcement.json");
        
        if (fs.existsSync(announcementPath)) {
            fs.unlinkSync(announcementPath);
        }
        
        // Log the action
        console.log(`[ADMIN_ACTION] System announcement cleared by admin`);
        
        res.json({ 
            success: true, 
            message: "Announcement cleared successfully"
        });
    } catch (error) {
        console.error("Error clearing announcement:", error);
        res.status(500).json({ error: "Failed to clear announcement" });
    }
});

// ============================================
// PHASE 5: AUDIT LOG
// ============================================

// Get admin actions log
adminPanelRouter.get("/audit-log", requireAdmin, async (req, res) => {
    try {
        // In production, this would query the activities table
        // For now, return empty (would need to add activity logging)
        res.json({
            actions: [],
            message: "Audit log feature coming soon"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch audit log" });
    }
});
