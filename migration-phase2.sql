-- ============================================
-- lesformateurs.online — Migration Phase 2
-- Aligne le schéma DB avec le code en production (2026-04-13)
-- À appliquer MANUELLEMENT sur Supabase via SQL editor.
-- ============================================

-- ====== 1. TABLE LEADS (capture funnels/acces/lien) ======
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT, -- ex: 'nda', 'qualiopi', 'opco', 'webinaire', etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Anon peut insérer (capture lead), seuls admins peuvent lire
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ====== 2. COLONNES PROFILES manquantes (utilisées par dashboard/admin/expert) ======
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS premium_since TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- ====== 3. REFERRALS + ACHATS (utilisés par supabase-config.js) ======
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_type TEXT,
  product_label TEXT,
  sale_amount_cents INT,
  commission_cents INT,
  is_recurring BOOLEAN DEFAULT FALSE,
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);

CREATE TABLE IF NOT EXISTS achats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_type TEXT,
  product_label TEXT,
  amount_cents INT,
  referrer_id UUID REFERENCES profiles(id),
  referral_code TEXT,
  commission_cents INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_achats_user ON achats(user_id);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = buyer_id);
CREATE POLICY "Users see own achats" ON achats FOR SELECT USING (auth.uid() = user_id);

-- ====== 4. NOTE : le code utilise encore `demarches_edof` (voir dashboard.html) ======
-- Si la table prod s'appelle `demarches`, renommer :
--   ALTER TABLE demarches RENAME TO demarches_edof;
-- OU créer un VIEW :
--   CREATE VIEW demarches_edof AS SELECT * FROM demarches;
