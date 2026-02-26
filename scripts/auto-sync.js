#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class GitAutoSync {
  constructor() {
    this.lastSyncTime = this.getLastSyncTime();
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
  }

  getLastSyncTime() {
    try {
      const syncFile = path.join(__dirname, '.last-sync');
      if (fs.existsSync(syncFile)) {
        return parseInt(fs.readFileSync(syncFile, 'utf8'));
      }
    } catch (error) {
      console.log('No previous sync time found');
    }
    return 0;
  }

  updateLastSyncTime() {
    try {
      const syncFile = path.join(__dirname, '.last-sync');
      fs.writeFileSync(syncFile, Date.now().toString());
    } catch (error) {
      console.log('Could not update sync time:', error.message);
    }
  }

  executeGitCommand(command) {
    try {
      const result = execSync(command, { 
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return { success: true, output: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async checkForChanges() {
    const statusResult = this.executeGitCommand('git status --porcelain');
    if (!statusResult.success) {
      console.log('Could not check git status');
      return false;
    }
    
    const hasUncommittedChanges = statusResult.output.trim().length > 0;
    
    const logResult = this.executeGitCommand('git log --oneline origin/main..HEAD');
    const hasUnpushedCommits = logResult.success && logResult.output.trim().length > 0;
    
    return hasUncommittedChanges || hasUnpushedCommits;
  }

  async syncToGitHub() {
    console.log('🔄 Starting GitHub sync...');
    
    // Check for changes
    const hasChanges = await this.checkForChanges();
    if (!hasChanges) {
      console.log('✅ No changes to sync');
      return;
    }

    // Add all changes
    const addResult = this.executeGitCommand('git add .');
    if (!addResult.success) {
      console.log('❌ Failed to add changes:', addResult.error);
      return;
    }

    // Check if there are staged changes
    const diffResult = this.executeGitCommand('git diff --cached --name-only');
    if (!diffResult.success || diffResult.output.trim().length === 0) {
      console.log('✅ No staged changes to commit');
      return;
    }

    // Commit changes
    const timestamp = new Date().toISOString();
    const commitMessage = `Auto-sync: Update TechPartner platform - ${timestamp}`;
    
    const commitResult = this.executeGitCommand(`git commit -m "${commitMessage}"`);
    if (!commitResult.success) {
      console.log('❌ Failed to commit changes:', commitResult.error);
      return;
    }

    // Pull latest changes
    const pullResult = this.executeGitCommand('git pull origin main --rebase');
    if (!pullResult.success) {
      console.log('⚠️  Pull failed, trying merge:', pullResult.error);
      this.executeGitCommand('git pull origin main --no-rebase');
    }

    // Push changes
    const pushResult = this.executeGitCommand('git push origin main');
    if (pushResult.success) {
      console.log('✅ Successfully synced to GitHub!');
      this.updateLastSyncTime();
    } else {
      console.log('❌ Failed to push to GitHub:', pushResult.error);
    }
  }

  startAutoSync() {
    console.log('🚀 Starting Auto-Sync System for TechPartner');
    console.log(`⏱️  Sync interval: ${this.syncInterval / 1000}s`);
    
    // Initial sync
    this.syncToGitHub();
    
    // Set up interval
    setInterval(() => {
      this.syncToGitHub();
    }, this.syncInterval);
  }
}

// Start the auto-sync system
const autoSync = new GitAutoSync();
autoSync.startAutoSync();