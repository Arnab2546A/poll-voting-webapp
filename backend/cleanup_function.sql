-- ============================================================
-- Auto-Delete Unverified Users After 5 Minutes
-- ============================================================
-- SETUP: Run this SQL in your Supabase SQL Editor
-- This will delete user accounts that haven't confirmed
-- their email within 5 minutes of registration
-- ============================================================

CREATE OR REPLACE FUNCTION delete_old_unverified_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete unverified users older than 5 minutes
  WITH deleted AS (
    DELETE FROM auth.users
    WHERE email_confirmed_at IS NULL
      AND created_at < NOW() - INTERVAL '5 minutes'
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  -- Return result as JSON
  RETURN json_build_object(
    'deleted', deleted_count,
    'timestamp', NOW()
  );
END;
$$;

-- Grant permissions to call this function
GRANT EXECUTE ON FUNCTION delete_old_unverified_users() TO authenticated;
GRANT EXECUTE ON FUNCTION delete_old_unverified_users() TO anon;

-- ============================================================
-- Test the function (uncomment to test)
-- ============================================================
-- SELECT delete_old_unverified_users();

-- ============================================================
-- View unverified users (for debugging)
-- ============================================================
-- SELECT 
--   email,
--   created_at,
--   email_confirmed_at,
--   ROUND(EXTRACT(EPOCH FROM (NOW() - created_at))/60) as minutes_old
-- FROM auth.users
-- WHERE email_confirmed_at IS NULL
-- ORDER BY created_at DESC;
