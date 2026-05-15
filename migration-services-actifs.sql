CREATE TABLE IF NOT EXISTS service_status (
  type TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE service_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads service_status" ON service_status FOR SELECT USING (true);
CREATE POLICY "Admin updates service_status" ON service_status FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
CREATE POLICY "Admin inserts service_status" ON service_status FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
-- Seed des 13 démarches + 5 services (active=true par défaut)
INSERT INTO service_status (type, category, active) VALUES
  ('nda','demarche',true),('edof','demarche',true),('qualiopi','demarche',true),
  ('creation_of','demarche',true),('habilitation','demarche',true),('certification','demarche',true),
  ('opco','demarche',true),('france_travail','demarche',true),('pack','demarche',true),
  ('controle','demarche',true),('creation_formation','demarche',true),
  ('uai','demarche',true),('centre_examen','demarche',true),
  ('site_web','service',true),('lms','service',true),('funnel','service',true),
  ('agents_ia','service',true),('pack_digital','service',true)
ON CONFLICT (type) DO NOTHING;
