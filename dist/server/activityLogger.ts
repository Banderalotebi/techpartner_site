import { db } from './db';
import { activities } from '../shared/schema';

/**
 * Logs a user or system activity to the activities table using Drizzle ORM.
 * @param params - Activity log parameters
 */
export async function logActivity(params: {
  userId?: number | null;
  event: string;
  entity?: string;
  entityId?: number | string;
  metadata?: Record<string, any>;
}) {
  const { userId = null, event, entity = null, entityId = null, metadata = {} } = params;
  try {
    // Log to console for development visibility
    console.log('🔍 Activity Log:', {
      userId,
      event,
      entity,
      entityId,
      metadata,
      timestamp: new Date().toISOString()
    });

    // Insert into activities table using Drizzle ORM
    await db.insert(activities).values({
      userId: userId ?? null,
      event,
      entity: entity ?? null,
      entityId: entityId ? String(entityId) : null,
      metadata: metadata ? metadata : null,
      createdAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to log activity:', error, params);
    return { success: false, error };
  }
}
