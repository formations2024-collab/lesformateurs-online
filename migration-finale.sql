-- ============================================
-- lesformateurs.online — MIGRATION Phase 1
-- Ajout des colonnes manquantes
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- ====== PROFILES : colonnes manquantes ======
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS formation_purchased BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS formation_progress INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iban TEXT;

-- Générer un referral_code automatique pour les profils existants qui n'en ont pas
UPDATE profiles SET referral_code = UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- Trigger pour générer un referral_code à l'inscription
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_referral_code ON profiles;
CREATE TRIGGER trg_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- ====== ANNONCES : colonnes manquantes ======
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS tarif_montant INT;
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS tarif_type TEXT DEFAULT 'jour' CHECK (tarif_type IN ('jour', 'heure'));
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS paused BOOLEAN DEFAULT FALSE;
ALTER TABLE annonces ADD COLUMN IF NOT EXISTS views INT DEFAULT 0;

-- ====== CANDIDATURES : colonnes manquantes ======
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS disponibilite TEXT;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE candidatures ADD COLUMN IF NOT EXISTS cv_url TEXT;

ALTER TABLE candidatures DROP CONSTRAINT IF EXISTS candidatures_status_check;
ALTER TABLE candidatures ADD CONSTRAINT candidatures_status_check 
  CHECK (status IN ('en_attente', 'acceptee', 'refusee', 'retiree', 'bloquee'));

-- ====== DEMARCHES : colonnes formulaire + fix constraint ======
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS client_phone TEXT;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS for_self BOOLEAN DEFAULT TRUE;

ALTER TABLE demarches DROP CONSTRAINT IF EXISTS demarches_type_check;
ALTER TABLE demarches ADD CONSTRAINT demarches_type_check
  CHECK (type IN ('nda', 'uai', 'qualiopi', 'edof', 'francetravail', 'rs_rncp', 'rs', 'opco', 'bpf', 'agent'));

-- ====== CREATIONS_OF : colonnes formulaire ======
ALTER TABLE creations_of ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';
ALTER TABLE creations_of ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE creations_of ADD COLUMN IF NOT EXISTS client_email TEXT;
ALTER TABLE creations_of ADD COLUMN IF NOT EXISTS client_phone TEXT;
ALTER TABLE creations_of ADD COLUMN IF NOT EXISTS selected_options JSONB DEFAULT '[]';

-- ====== MESSAGES (nouvelle table) ======
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demarche_id UUID REFERENCES demarches(id) ON DELETE CASCADE,
  creation_of_id UUID REFERENCES creations_of(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT messages_context CHECK (demarche_id IS NOT NULL OR creation_of_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_messages_demarche ON messages(demarche_id);
CREATE INDEX IF NOT EXISTS idx_messages_creation ON messages(creation_of_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages participants read" ON messages;
CREATE POLICY "Messages participants read" ON messages FOR SELECT USING (
  auth.uid() = sender_id
  OR EXISTS (SELECT 1 FROM demarches WHERE demarches.id = messages.demarche_id AND (demarches.user_id = auth.uid() OR demarches.expert_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM creations_of WHERE creations_of.id = messages.creation_of_id AND (creations_of.user_id = auth.uid() OR creations_of.expert_id = auth.uid()))
);

DROP POLICY IF EXISTS "Messages participants insert" ON messages;
CREATE POLICY "Messages participants insert" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);

-- ====== REFERRALS (nouvelle table) ======
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  payment_id UUID REFERENCES payments(id),
  commission_cents INT DEFAULT 0,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'confirmed', 'paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own referrals" ON referrals;
CREATE POLICY "Users see own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);

-- ====== RLS POLICIES ======

DROP POLICY IF EXISTS "Annonce owner sees candidatures" ON candidatures;
CREATE POLICY "Annonce owner sees candidatures" ON candidatures FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM annonces 
    WHERE annonces.id = candidatures.annonce_id 
    AND annonces.author_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Annonce owner updates candidatures" ON candidatures;
CREATE POLICY "Annonce owner updates candidatures" ON candidatures FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM annonces 
    WHERE annonces.id = candidatures.annonce_id 
    AND annonces.author_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users insert own candidatures" ON candidatures;
CREATE POLICY "Users insert own candidatures" ON candidatures FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users delete own candidatures" ON candidatures;
CREATE POLICY "Users delete own candidatures" ON candidatures FOR DELETE USING (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Expert update assigned demarches" ON demarches;
CREATE POLICY "Expert update assigned demarches" ON demarches FOR UPDATE USING (
  auth.uid() = expert_id
);

DROP POLICY IF EXISTS "Expert update assigned creations" ON creations_of;
CREATE POLICY "Expert update assigned creations" ON creations_of FOR UPDATE USING (
  auth.uid() = expert_id
);

DROP POLICY IF EXISTS "Expert docs access" ON documents;
CREATE POLICY "Expert docs access" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM demarches WHERE demarches.id = documents.demarche_id AND demarches.expert_id = auth.uid())
  OR EXISTS (SELECT 1 FROM creations_of WHERE creations_of.id = documents.creation_of_id AND creations_of.expert_id = auth.uid())
);

DROP POLICY IF EXISTS "Users insert annonces" ON annonces;
CREATE POLICY "Users insert annonces" ON annonces FOR INSERT WITH CHECK (
  auth.uid() = author_id
);

DROP POLICY IF EXISTS "Users insert demarches" ON demarches;
CREATE POLICY "Users insert demarches" ON demarches FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users insert creations" ON creations_of;
CREATE POLICY "Users insert creations" ON creations_of FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users insert formations" ON formations;
CREATE POLICY "Users insert formations" ON formations FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users insert payments" ON payments;
CREATE POLICY "Users insert payments" ON payments FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- ====== FIN MIGRATION ======
