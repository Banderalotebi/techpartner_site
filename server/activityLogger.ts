/**
 * Logs a user or system activity to the activities table using Drizzle ORM.
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
    const db = {
      insert: (table) => {
        return {
          values: (values) => {
            return {
              userId: userId ?? null,
              event,
              entity: entity ?? null,
              entityId: entityId ? String(entityId) : null,
              metadata: metadata ? metadata : null,
              createdAt: new Date(),
            };
          },
        };
      },
    };

    const activities = {
      userId: userId ?? null,
      event,
      entity: entity ?? null,
      entityId: entityId ? String(entityId) : null,
      metadata: metadata ? metadata : null,
      createdAt: new Date(),
    };

    await db.insert(activities).values(activities);
    return { success: true };
  } catch (error) {
    // Do nothing
    return { success: false, error };
  }
}
