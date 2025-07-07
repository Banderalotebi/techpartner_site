#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';

class AutoSyncDaemon {
  constructor() {
    this.isRunning = false;
    this.syncInterval = 30000; // 30 seconds
    this.maxCommitsPerHour = 20;
    this.commitCount = 0;
    this.lastResetTime = Date.now();
    
    console.log('🚀 Auto-Sync Daemon Starting...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏱️  Sync interval: ${this.syncInterval / 1000}s`);
    console.log(`🔄 Max commits per hour: ${this.maxCommitsPerHour}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  async start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('👁️  Starting continuous file monitoring...');
    
    // Initial sync
    await this.performSync();
    
    // Start monitoring loop
    this.monitorLoop();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop());
    process.on('SIGTERM', () => this.stop());
  }

  async monitorLoop() {
    while (this.isRunning) {
      try {
        await this.sleep(this.syncInterval);
        
        // Reset commit counter every hour
        if (Date.now() - this.lastResetTime > 3600000) {
          this.commitCount = 0;
          this.lastResetTime = Date.now();
          console.log('🔄 Hourly commit counter reset');
        }
        
        await this.performSync();
      } catch (error) {
        console.error('❌ Error in monitor loop:', error.message);
        await this.sleep(5000); // Wait 5 seconds before retry
      }
    }
  }

  async performSync() {
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // Check for changes
      const hasChanges = await this.checkForChanges();
      
      if (hasChanges) {
        console.log(`[${timestamp}] 📝 Changes detected`);
        
        if (this.commitCount >= this.maxCommitsPerHour) {
          console.log(`[${timestamp}] ⚠️  Commit limit reached (${this.maxCommitsPerHour}/hour)`);
          return;
        }
        
        // Auto-commit changes
        await this.autoCommit();
        
        // Try to push
        await this.autoPush();
        
      } else {
        // Check for unpushed commits
        await this.checkUnpushedCommits();
      }
      
      // Periodically pull remote changes
      if (this.commitCount % 5 === 0) {
        await this.pullRemoteChanges();
      }
      
    } catch (error) {
      console.error(`[${timestamp}] ❌ Sync error:`, error.message);
    }
  }

  async checkForChanges() {
    return new Promise((resolve) => {
      exec('git status --porcelain', { cwd: process.cwd() }, (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }
        resolve(stdout.trim().length > 0);
      });
    });
  }

  async autoCommit() {
    const timestamp = new Date().toISOString();
    const commitMessage = `Auto-sync: TechPartner platform updates [${timestamp}] (#${this.commitCount + 1})`;
    
    return new Promise((resolve, reject) => {
      exec('git add .', { cwd: process.cwd() }, (addError) => {
        if (addError) {
          reject(new Error(`Git add failed: ${addError.message}`));
          return;
        }
        
        exec(`git commit -m "${commitMessage}"`, { cwd: process.cwd() }, (commitError) => {
          if (commitError) {
            // Might be nothing to commit
            resolve(false);
            return;
          }
          
          this.commitCount++;
          console.log(`✅ Auto-commit #${this.commitCount} successful`);
          resolve(true);
        });
      });
    });
  }

  async autoPush() {
    return new Promise((resolve) => {
      exec('git push origin main', { cwd: process.cwd() }, (error) => {
        if (error) {
          console.log('⚠️  Push failed - will retry next cycle');
          resolve(false);
        } else {
          console.log('📤 Auto-push successful');
          resolve(true);
        }
      });
    });
  }

  async checkUnpushedCommits() {
    return new Promise((resolve) => {
      exec('git log origin/main..HEAD --oneline', { cwd: process.cwd() }, (error, stdout) => {
        if (error) {
          resolve(false);
          return;
        }
        
        const unpushedCount = stdout.trim().split('\n').filter(line => line.length > 0).length;
        if (unpushedCount > 0) {
          console.log(`📤 Attempting to push ${unpushedCount} unpushed commits...`);
          this.autoPush();
        }
        resolve(unpushedCount > 0);
      });
    });
  }

  async pullRemoteChanges() {
    return new Promise((resolve) => {
      exec('git fetch origin main', { cwd: process.cwd() }, (fetchError) => {
        if (fetchError) {
          resolve(false);
          return;
        }
        
        exec('git log HEAD..origin/main --oneline', { cwd: process.cwd() }, (logError, stdout) => {
          if (logError) {
            resolve(false);
            return;
          }
          
          const remoteCommits = stdout.trim().split('\n').filter(line => line.length > 0).length;
          if (remoteCommits > 0) {
            console.log(`⬇️  ${remoteCommits} remote commits detected - pulling...`);
            
            exec('git pull origin main --no-edit', { cwd: process.cwd() }, (pullError) => {
              if (pullError) {
                console.log('⚠️  Pull failed - might need manual resolution');
                resolve(false);
              } else {
                console.log('✅ Remote changes pulled successfully');
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        });
      });
    });
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    console.log('\n🛑 Stopping Auto-Sync Daemon...');
    this.isRunning = false;
    
    console.log('📊 Session Summary:');
    console.log(`   • Auto-commits made: ${this.commitCount}`);
    console.log(`   • Session duration: ${Math.round((Date.now() - this.lastResetTime) / 60000)} minutes`);
    console.log('🎯 Auto-sync daemon stopped successfully');
    
    process.exit(0);
  }
}

// Start the daemon
const daemon = new AutoSyncDaemon();
daemon.start().catch(error => {
  console.error('❌ Failed to start auto-sync daemon:', error);
  process.exit(1);
});

console.log('💡 Auto-sync daemon is running. Press Ctrl+C to stop.');