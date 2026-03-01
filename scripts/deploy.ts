#!/usr/bin/env tsx
/**
 * Simple deployment script for TechPartner
 * Usage: npm run deploy
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const SERVER = 'ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com';
const KEY = process.env.SSH_KEY || '~/Downloads/kimi-key.pem';
const REMOTE_PATH = '~/techpartner';

function runLocal(cmd: string) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { stdio: 'inherit' });
}

function runRemote(cmd: string) {
  console.log(`[SERVER] $ ${cmd}`);
  return execSync(`ssh -i ${KEY} ${SERVER} "${cmd}"`, { stdio: 'inherit' });
}

console.log('🚀 Deploying TechPartner to EC2...\n');

// Check if key exists
if (!existsSync(KEY.replace('~', process.env.HOME || ''))) {
  console.error(`❌ SSH key not found: ${KEY}`);
  console.log('Set SSH_KEY env var or place key at ~/Downloads/kimi-key.pem');
  process.exit(1);
}

// 1. Deploy server files
console.log('📦 Copying files...');
runLocal(`scp -i ${KEY} -r server package.json ecosystem.config.cjs ${SERVER}:${REMOTE_PATH}/`);

// 2. Install dependencies and restart
console.log('\n🔧 Installing dependencies...');
runRemote(`cd ${REMOTE_PATH} && npm install --legacy-peer-deps`);

console.log('\n🔄 Restarting server...');
runRemote(`cd ${REMOTE_PATH} && pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs`);

// 3. Test health
console.log('\n🏥 Testing health...');
try {
  execSync(`ssh -i ${KEY} ${SERVER} "sleep 3 && curl -s http://localhost:8080/api/health"`, { stdio: 'inherit' });
  console.log('\n✅ Deployment successful!');
} catch (e) {
  console.log('\n⚠️  Health check failed, check logs:');
  runRemote(`pm2 logs techpartner --lines 20`);
}
