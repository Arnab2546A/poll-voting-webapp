import { supabase } from '../supabaseClient';

// Track last cleanup time to avoid excessive calls
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 60000; // 1 minute in milliseconds

/**
 * Triggers cleanup of unverified users older than 5 minutes
 * Rate-limited to run max once per minute
 */
export async function triggerUnverifiedUsersCleanup() {
  const now = Date.now();
  
  // Rate limiting: only run once per minute
  if (now - lastCleanupTime < CLEANUP_INTERVAL) {
    return { skipped: true, reason: 'Rate limited' };
  }
  
  lastCleanupTime = now;
  
  try {
    // Call the database function
    const { data, error } = await supabase.rpc('delete_old_unverified_users');
    
    if (error) {
      console.warn('Unverified users cleanup failed:', error.message);
      return { success: false, error: error.message };
    }
    
    if (data?.deleted > 0) {
      console.log(`🧹 Cleaned up ${data.deleted} unverified user(s)`);
    }
    
    return { 
      success: true, 
      deleted: data?.deleted || 0,
      timestamp: data?.timestamp 
    };
  } catch (err) {
    console.warn('Cleanup error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Initialize automatic cleanup on app load
 * Call this once when your app starts
 */
export function initAutoCleanup() {
  // Trigger cleanup immediately on app load
  triggerUnverifiedUsersCleanup()
    .then(result => {
      if (result.success && result.deleted > 0) {
        console.log(`Auto-cleanup completed: ${result.deleted} users removed`);
      }
    })
    .catch(err => console.warn('Auto-cleanup init failed:', err));
}
