-- ============================================================
-- Migration : inscriptions formation (Formateur RS 36h)
-- À APPLIQUER MANUELLEMENT dans Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS formation_inscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  formation_slug TEXT NOT NULL DEFAULT 'formateur-rs',
  formation_title TEXT NOT NULL DEFAULT 'Formation Formateur RS',

  statut TEXT,               -- salarie / demandeur_emploi / independant / formateur / dirigeant / autre
  has_of BOOLEAN,            -- true = a déjà un OF
  financement_type TEXT,     -- cpf_demandeur / cpf_autre / fifpl / comptant / 3x / opco
  session_date DATE,
  session_label TEXT,
  comment TEXT,

  status TEXT NOT NULL DEFAULT 'nouveau'
    CHECK (status IN ('nouveau','confirme','annule','termine')),
  admin_note TEXT,
  admin_decision_at TIMESTAMPTZ,
  admin_decision_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cancel_reason TEXT,

  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_fi_status ON formation_inscriptions(status);
CREATE INDEX IF NOT EXISTS idx_fi_email ON formation_inscriptions(email);
CREATE INDEX IF NOT EXISTS idx_fi_user ON formation_inscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_fi_created ON formation_inscriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fi_session ON formation_inscriptions(session_date);

ALTER TABLE formation_inscriptions ENABLE ROW LEVEL SECURITY;

-- Insert : anonymes et connectés peuvent s'inscrire
DROP POLICY IF EXISTS "Anyone inserts inscription" ON formation_inscriptions;
CREATE POLICY "Anyone inserts inscription" ON formation_inscriptions
  FOR INSERT WITH CHECK (true);

-- Select : admin voit tout, user voit ses propres inscriptions
DROP POLICY IF EXISTS "Admin reads all inscriptions" ON formation_inscriptions;
CREATE POLICY "Admin reads all inscriptions" ON formation_inscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
    OR user_id = auth.uid()
  );

-- Update : admin uniquement (ALL)
DROP POLICY IF EXISTS "Admin updates inscriptions" ON formation_inscriptions;
CREATE POLICY "Admin updates inscriptions" ON formation_inscriptions
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admin deletes inscriptions" ON formation_inscriptions;
CREATE POLICY "Admin deletes inscriptions" ON formation_inscriptions
  FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
