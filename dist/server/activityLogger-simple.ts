/**
 * Logs a user or system activity to the console (development mode).
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
    console.log('Activity Log:', {
      userId,
      event,
      entity,
      entityId,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to log activity:', error);
    return { success: false, error };
  }
}
