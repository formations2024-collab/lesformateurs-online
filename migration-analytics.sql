CREATE TABLE IF NOT EXISTS analytics_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  screen_width INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_av_created ON analytics_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_av_page ON analytics_visits (page);
CREATE INDEX IF NOT EXISTS idx_av_session ON analytics_visits (session_id);

CREATE TABLE IF NOT EXISTS analytics_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  page TEXT,
  element TEXT,
  element_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ac_created ON analytics_clicks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ac_page ON analytics_clicks (page);

ALTER TABLE analytics_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone inserts visits" ON analytics_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone inserts clicks" ON analytics_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads visits" ON analytics_visits FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
CREATE POLICY "Admin reads clicks" ON analytics_clicks FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
