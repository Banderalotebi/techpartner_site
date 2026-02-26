import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GitHubAutoSync {
  constructor() {
    this.isGitRepo = this.checkGitRepository();
    this.lastSyncFile = path.join(__dirname, '..', '.last-sync');
  }

  checkGitRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch (error) {
      console.log('❌ Not a git repository');
      return false;
    }
  }

  configureGit() {
    try {
      execSync('git config user.name "TechPartner Auto-Sync"', { stdio: 'ignore' });
      execSync('git config user.email "autosync@techpartner.dev"', { stdio: 'ignore' });
      console.log('✅ Git configured for auto-sync');
    } catch (error) {
      console.log('⚠️ Git configuration warning:', error.message);
    }
  }

  executeCommand(command, options = {}) {
    try {
      const result = execSync(command, { 
        encoding: 'utf8', 
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options 
      });
      return { success: true, output: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message, 
        output: error.stdout || error.stderr 
      };
    }
  }

  getRepositoryStatus() {
    if (!this.isGitRepo) return null;

    const status = this.executeCommand('git status --porcelain', { silent: true });
    const ahead = this.executeCommand('git rev-list --count origin/main..HEAD', { silent: true });
    const behind = this.executeCommand('git rev-list --count HEAD..origin/main', { silent: true });

    return {
      hasUncommittedChanges: status.success && status.output.trim().length > 0,
      commitsAhead: ahead.success ? parseInt(ahead.output.trim()) || 0 : 0,
      commitsBehind: behind.success ? parseInt(behind.output.trim()) || 0 : 0,
      lastSync: this.getLastSyncTime()
    };
  }

  getLastSyncTime() {
    try {
      if (fs.existsSync(this.lastSyncFile)) {
        return new Date(fs.readFileSync(this.lastSyncFile, 'utf8'));
      }
    } catch (error) {
      // File doesn't exist or invalid date
    }
    return null;
  }

  updateLastSyncTime() {
    try {
      fs.writeFileSync(this.lastSyncFile, new Date().toISOString());
    } catch (error) {
      console.log('⚠️ Could not update sync time:', error.message);
    }
  }

  async pullFromRemote() {
    console.log('⬇️ Pulling latest changes from GitHub...');
    
    // Fetch first
    const fetch = this.executeCommand('git fetch origin main');
    if (!fetch.success) {
      console.log('❌ Failed to fetch from remote:', fetch.error);
      return false;
    }

    // Check if we need to pull
    const status = this.getRepositoryStatus();
    if (status.commitsBehind === 0) {
      console.log('✅ Already up to date with remote');
      return true;
    }

    // Stash local changes if any
    let stashed = false;
    if (status.hasUncommittedChanges) {
      console.log('📦 Stashing uncommitted changes...');
      const stash = this.executeCommand('git stash push -m "Auto-sync stash"');
      stashed = stash.success;
    }

    // Pull changes
    const pull = this.executeCommand('git merge origin/main --no-edit');
    if (!pull.success) {
      console.log('❌ Failed to merge remote changes:', pull.error);
      return false;
    }

    // Restore stashed changes
    if (stashed) {
      console.log('📦 Restoring stashed changes...');
      const restore = this.executeCommand('git stash pop');
      if (!restore.success) {
        console.log('⚠️ Could not restore stashed changes automatically');
      }
    }

    console.log('✅ Successfully pulled changes from remote');
    return true;
  }

  async pushToRemote(commitMessage = null) {
    console.log('⬆️ Pushing changes to GitHub...');

    const status = this.getRepositoryStatus();
    
    // Add all changes
    if (status.hasUncommittedChanges) {
      console.log('📝 Adding uncommitted changes...');
      const add = this.executeCommand('git add .');
      if (!add.success) {
        console.log('❌ Failed to add changes:', add.error);
        return false;
      }

      // Commit changes
      const message = commitMessage || `Auto-sync: TechPartner updates ${new Date().toISOString()}`;
      const commit = this.executeCommand(`git commit -m "${message}"`);
      if (!commit.success) {
        console.log('❌ Failed to commit changes:', commit.error);
        return false;
      }
    }

    // Push to remote
    const push = this.executeCommand('git push origin main');
    if (!push.success) {
      console.log('❌ Failed to push to remote:', push.error);
      return false;
    }

    console.log('✅ Successfully pushed changes to remote');
    return true;
  }

  async bidirectionalSync() {
    console.log('🔄 Starting bidirectional sync...');
    
    if (!this.isGitRepo) {
      console.log('❌ Not in a git repository');
      return false;
    }

    this.configureGit();

    // Step 1: Pull latest changes
    const pullSuccess = await this.pullFromRemote();
    if (!pullSuccess) {
      console.log('❌ Pull failed, aborting sync');
      return false;
    }

    // Step 2: Push local changes
    const pushSuccess = await this.pushToRemote();
    if (!pushSuccess) {
      console.log('❌ Push failed, but pull was successful');
      return false;
    }

    // Update sync time
    this.updateLastSyncTime();
    
    console.log('✅ Bidirectional sync completed successfully');
    return true;
  }

  startContinuousSync(intervalMinutes = 5) {
    console.log(`🚀 Starting continuous sync every ${intervalMinutes} minutes...`);
    
    const sync = async () => {
      try {
        console.log(`\n[${new Date().toLocaleTimeString()}] Running auto-sync...`);
        await this.bidirectionalSync();
      } catch (error) {
        console.log('❌ Sync error:', error.message);
      }
    };

    // Initial sync
    sync();

    // Set up interval
    const interval = setInterval(sync, intervalMinutes * 60 * 1000);

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping continuous sync...');
      clearInterval(interval);
      process.exit(0);
    });

    return interval;
  }

  printStatus() {
    console.log('\n📊 GitHub Auto-Sync Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (!this.isGitRepo) {
      console.log('❌ Not a git repository');
      return;
    }

    const status = this.getRepositoryStatus();
    if (!status) {
      console.log('❌ Could not determine repository status');
      return;
    }

    console.log(`📝 Uncommitted changes: ${status.hasUncommittedChanges ? 'Yes' : 'No'}`);
    console.log(`⬆️ Commits ahead: ${status.commitsAhead}`);
    console.log(`⬇️ Commits behind: ${status.commitsBehind}`);
    console.log(`🕒 Last sync: ${status.lastSync ? status.lastSync.toLocaleString() : 'Never'}`);
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    if (status.hasUncommittedChanges || status.commitsAhead > 0) {
      console.log('   • Run sync to push local changes');
    }
    if (status.commitsBehind > 0) {
      console.log('   • Run sync to pull remote changes');
    }
    if (!status.hasUncommittedChanges && status.commitsAhead === 0 && status.commitsBehind === 0) {
      console.log('   • Repository is in sync ✅');
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const autoSync = new GitHubAutoSync();
  const command = process.argv[2];

  switch (command) {
    case 'status':
      autoSync.printStatus();
      break;
    
    case 'pull':
      autoSync.pullFromRemote();
      break;
    
    case 'push':
      const message = process.argv[3];
      autoSync.pushToRemote(message);
      break;
    
    case 'sync':
      autoSync.bidirectionalSync();
      break;
    
    case 'watch':
      const interval = parseInt(process.argv[3]) || 5;
      autoSync.startContinuousSync(interval);
      break;
    
    default:
      console.log('GitHub Auto-Sync for TechPartner Platform');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/github-sync.js status     - Show repository status');
      console.log('  node scripts/github-sync.js pull       - Pull from GitHub');
      console.log('  node scripts/github-sync.js push       - Push to GitHub');
      console.log('  node scripts/github-sync.js sync       - Bidirectional sync');
      console.log('  node scripts/github-sync.js watch [min] - Continuous sync (default: 5 min)');
      break;
  }
}

export { GitHubAutoSync };