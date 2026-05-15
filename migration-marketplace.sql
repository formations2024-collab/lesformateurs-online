-- Marketplace : achat/vente de centres de formation
-- À appliquer manuellement dans la console SQL Supabase

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organisme_id UUID REFERENCES user_organismes(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  raison_sociale TEXT,
  siren TEXT,
  siret TEXT,
  city TEXT,
  region TEXT,
  department TEXT,
  year_created INT,
  nb_formateurs INT DEFAULT 0,
  nb_salaries INT DEFAULT 0,
  nb_salles INT DEFAULT 0,
  nb_stagiaires_year INT DEFAULT 0,
  nb_formations_actives INT DEFAULT 0,
  revenue_cents BIGINT DEFAULT 0,
  price_cents BIGINT NOT NULL,
  price_tier TEXT,
  has_nda BOOLEAN DEFAULT FALSE,
  nda_num TEXT,
  has_qualiopi BOOLEAN DEFAULT FALSE,
  qualiopi_actions JSONB DEFAULT '[]'::jsonb,
  has_edof BOOLEAN DEFAULT FALSE,
  has_opco BOOLEAN DEFAULT FALSE,
  opco_list JSONB DEFAULT '[]'::jsonb,
  has_france_travail BOOLEAN DEFAULT FALSE,
  has_centre_examen BOOLEAN DEFAULT FALSE,
  has_cfa BOOLEAN DEFAULT FALSE,
  has_uai BOOLEAN DEFAULT FALSE,
  uai_num TEXT,
  has_agrement_prefectoral BOOLEAN DEFAULT FALSE,
  has_rsrncp BOOLEAN DEFAULT FALSE,
  rsrncp_fiches JSONB DEFAULT '[]'::jsonb,
  warnings JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended','sold')),
  sold_at TIMESTAMPTZ,
  sold_price_cents BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ml_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_ml_price ON marketplace_listings(price_cents);
CREATE INDEX IF NOT EXISTS idx_ml_seller ON marketplace_listings(seller_id);

CREATE TABLE IF NOT EXISTS marketplace_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_mi_listing ON marketplace_interests(listing_id);

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_interests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone reads active listings" ON marketplace_listings;
CREATE POLICY "Anyone reads active listings" ON marketplace_listings FOR SELECT USING (status='active' OR auth.uid()=seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
DROP POLICY IF EXISTS "Seller inserts own listings" ON marketplace_listings;
CREATE POLICY "Seller inserts own listings" ON marketplace_listings FOR INSERT WITH CHECK (auth.uid()=seller_id);
DROP POLICY IF EXISTS "Seller/admin update" ON marketplace_listings;
CREATE POLICY "Seller/admin update" ON marketplace_listings FOR UPDATE USING (auth.uid()=seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
DROP POLICY IF EXISTS "Admin/seller delete" ON marketplace_listings;
CREATE POLICY "Admin/seller delete" ON marketplace_listings FOR DELETE USING (auth.uid()=seller_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));

DROP POLICY IF EXISTS "Users see relevant interests" ON marketplace_interests;
CREATE POLICY "Users see relevant interests" ON marketplace_interests FOR SELECT USING (auth.uid()=user_id OR EXISTS (SELECT 1 FROM marketplace_listings ml WHERE ml.id=listing_id AND ml.seller_id=auth.uid()) OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
DROP POLICY IF EXISTS "Users insert own interest" ON marketplace_interests;
CREATE POLICY "Users insert own interest" ON marketplace_interests FOR INSERT WITH CHECK (auth.uid()=user_id);
DROP POLICY IF EXISTS "Users delete own interest" ON marketplace_interests;
CREATE POLICY "Users delete own interest" ON marketplace_interests FOR DELETE USING (auth.uid()=user_id OR EXISTS (SELECT 1 FROM profiles WHERE id=auth.uid() AND is_admin=true));
