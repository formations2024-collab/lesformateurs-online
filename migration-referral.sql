-- ============================================
-- lesformateurs.online — Referral system
-- ============================================
-- Apply this migration via the Supabase SQL editor.

-- Table earnings
CREATE TABLE IF NOT EXISTS referral_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  demarche_id UUID REFERENCES demarches(id) ON DELETE SET NULL,
  amount_cents INT,
  commission_cents INT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  paid_at TIMESTAMPTZ,
  iban TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rearn_ref ON referral_earnings(referrer_id);
CREATE INDEX IF NOT EXISTS idx_rearn_status ON referral_earnings(status);
ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own earnings" ON referral_earnings;
CREATE POLICY "Users see own earnings" ON referral_earnings FOR SELECT
  USING (auth.uid()=referrer_id OR auth.uid()=referred_id);

DROP POLICY IF EXISTS "Admin all earnings" ON referral_earnings;
CREATE POLICY "Admin all earnings" ON referral_earnings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));

-- Colonnes profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_balance_cents INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iban TEXT;

-- Génère referral_code aux comptes sans code
UPDATE profiles
  SET referral_code = UPPER(substr(md5(random()::text||id::text), 1, 8))
  WHERE referral_code IS NULL;
