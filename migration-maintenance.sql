-- lesformateurs.online — Maintenance mode settings
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES ('maintenance_mode', 'false') ON CONFLICT DO NOTHING;
INSERT INTO site_settings (key, value) VALUES ('maintenance_start', '') ON CONFLICT DO NOTHING;
INSERT INTO site_settings (key, value) VALUES ('maintenance_end', '') ON CONFLICT DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read settings" ON site_settings;
CREATE POLICY "Anyone can read settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can update settings" ON site_settings;
CREATE POLICY "Admin can update settings" ON site_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
