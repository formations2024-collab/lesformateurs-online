-- ============================================================
-- Migration : système complet candidatures experts + cooptation
-- Remplace expert_applications par expert_candidatures
-- À APPLIQUER MANUELLEMENT dans Supabase SQL Editor
-- PUIS créer bucket Storage PRIVÉ "candidatures" dans Dashboard
-- ============================================================

CREATE TABLE IF NOT EXISTS expert_candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  years_experience TEXT,
  cv_url TEXT,
  cv_filename TEXT,
  presentation TEXT,
  social_link TEXT,
  missions_demarches JSONB DEFAULT '[]'::jsonb,
  missions_autres_precision TEXT,
  services_events JSONB DEFAULT '[]'::jsonb,
  referrer_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referrer_code TEXT,
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau','accepte','reserve','refuse')),
  admin_decision_reason TEXT,
  admin_decision_at TIMESTAMPTZ,
  admin_decision_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ec_status ON expert_candidatures(status);
CREATE INDEX IF NOT EXISTS idx_ec_email ON expert_candidatures(email);
CREATE INDEX IF NOT EXISTS idx_ec_referrer ON expert_candidatures(referrer_user_id);

ALTER TABLE expert_candidatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone inserts candidature" ON expert_candidatures;
CREATE POLICY "Anyone inserts candidature" ON expert_candidatures
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin reads all candidatures" ON expert_candidatures;
CREATE POLICY "Admin reads all candidatures" ON expert_candidatures
  FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));

DROP POLICY IF EXISTS "Admin updates candidatures" ON expert_candidatures;
CREATE POLICY "Admin updates candidatures" ON expert_candidatures
  FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));

-- ============================================================
-- Crédits cooptation
-- ============================================================
CREATE TABLE IF NOT EXISTS cooptation_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  candidature_id UUID REFERENCES expert_candidatures(id) ON DELETE CASCADE,
  expert_email TEXT,
  amount_cents INT DEFAULT 5000,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','available','claimed')),
  activated_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cc_referrer ON cooptation_credits(referrer_id);
CREATE INDEX IF NOT EXISTS idx_cc_email ON cooptation_credits(expert_email);
CREATE INDEX IF NOT EXISTS idx_cc_status ON cooptation_credits(status);

ALTER TABLE cooptation_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own cooptation_credits" ON cooptation_credits;
CREATE POLICY "Users see own cooptation_credits" ON cooptation_credits
  FOR SELECT USING (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Admin all cooptation_credits" ON cooptation_credits;
CREATE POLICY "Admin all cooptation_credits" ON cooptation_credits
  FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));

DROP POLICY IF EXISTS "Users claim own cooptation_credits" ON cooptation_credits;
CREATE POLICY "Users claim own cooptation_credits" ON cooptation_credits
  FOR UPDATE USING (auth.uid() = referrer_id AND status='available');

-- ============================================================
-- Fonction trigger : activer crédit pending -> available
-- à la 1ère mission terminée (ou payée) de l'expert coopté
-- ============================================================
CREATE OR REPLACE FUNCTION activate_cooptation_credit_on_mission() RETURNS TRIGGER AS $$
DECLARE
  v_email TEXT;
BEGIN
  IF (NEW.status = 'termine' OR (NEW.paid = true AND (OLD.paid IS DISTINCT FROM true))) AND NEW.assigned_expert_id IS NOT NULL THEN
    SELECT email INTO v_email FROM profiles WHERE id = NEW.assigned_expert_id;
    IF v_email IS NOT NULL THEN
      UPDATE cooptation_credits
      SET status = 'available', activated_at = NOW()
      WHERE id IN (
        SELECT id FROM cooptation_credits
        WHERE expert_email = v_email AND status = 'pending'
        LIMIT 1
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_activate_cooptation ON demarches;
CREATE TRIGGER trg_activate_cooptation
  AFTER UPDATE ON demarches
  FOR EACH ROW EXECUTE FUNCTION activate_cooptation_credit_on_mission();

-- ============================================================
-- Bucket Storage à créer manuellement dans Supabase Dashboard :
-- Nom : candidatures
-- Public : NON (privé)
-- Policies :
--   INSERT : autorisé à tous (anon/authenticated) pour permettre upload public
--   SELECT : réservé aux admins
-- ============================================================
