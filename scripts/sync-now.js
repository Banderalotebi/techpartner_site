#!/usr/bin/env node

import { execSync } from 'child_process';

function executeCommand(command) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'inherit'
    });
    return true;
  } catch (error) {
    console.log(`❌ Command failed: ${command}`);
    console.log(`Error: ${error.message}`);
    return false;
  }
}

async function syncNow() {
  console.log('🔄 Manual GitHub Sync Started...');
  
  // Configure git
  console.log('⚙️  Configuring Git...');
  executeCommand('git config user.email "banderalotebi@gmail.com"');
  executeCommand('git config user.name "Banderalotebi"');
  
  // Add all changes
  console.log('📦 Adding changes...');
  if (!executeCommand('git add .')) return;
  
  // Check for changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim().length === 0) {
      console.log('✅ No changes to commit');
      return;
    }
  } catch (error) {
    console.log('❌ Could not check git status');
    return;
  }
  
  // Commit changes
  const timestamp = new Date().toISOString();
  const commitMessage = `Sync: TechPartner platform updates - ${timestamp}`;
  console.log('💾 Committing changes...');
  if (!executeCommand(`git commit -m "${commitMessage}"`)) return;
  
  // Pull latest
  console.log('⬇️  Pulling latest changes...');
  executeCommand('git pull origin main --rebase');
  
  // Push changes
  console.log('⬆️  Pushing to GitHub...');
  if (executeCommand('git push origin main')) {
    console.log('✅ Successfully synced to GitHub!');
    console.log('🎉 Your local environment will now see the latest changes');
  }
}

syncNow();