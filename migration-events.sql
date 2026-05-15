ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'online';
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_places INT DEFAULT 50;
ALTER TABLE events ADD COLUMN IF NOT EXISTS price_cents INT DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_free BOOLEAN DEFAULT TRUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID;

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own registrations" ON event_registrations FOR ALL USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "Admin read all regs" ON event_registrations FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
