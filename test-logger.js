import { logActivity } from './server/activityLogger.js';

console.log('🧪 Testing Activity Logger...');

await logActivity({
  userId: null,
  event: 'TEST_ACTIVITY_LOGGER',
  entity: 'test',
  entityId: 'test-123',
  metadata: {
    message: 'Testing if activity logger works',
    timestamp: new Date().toISOString()
  }
});

console.log('✅ Activity logger test completed');
