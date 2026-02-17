import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mshwiemboewoadczggnh.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaHdpZW1ib2V3b2FkY3pnZ25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDk5MDgsImV4cCI6MjA4Njg4NTkwOH0.kfeMvhRLrI1hsBr7Rfb_mjjPw91UEhw6F7asB5cExeg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
