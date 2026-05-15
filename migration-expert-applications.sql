-- Migration: table des candidatures experts (devenir-expert.html)
CREATE TABLE IF NOT EXISTS expert_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  experience_years TEXT,
  cv_path TEXT,
  presentation TEXT,
  specialites JSONB DEFAULT '[]'::jsonb,
  availabilities JSONB DEFAULT '{}'::jsonb,
  hours_week TEXT,
  work_mode TEXT,
  referred_by_code TEXT,
  referred_by_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ea_status ON expert_applications(status);
CREATE INDEX IF NOT EXISTS idx_ea_email  ON expert_applications(email);

ALTER TABLE expert_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert application" ON expert_applications;
CREATE POLICY "Anyone can insert application" ON expert_applications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read" ON expert_applications;
CREATE POLICY "Admin read" ON expert_applications
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admin update" ON expert_applications;
CREATE POLICY "Admin update" ON expert_applications
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Bucket Storage "expert-applications" à créer manuellement, en PRIVÉ, via Supabase Studio.
