-- ════════════════════════════════════════════════════════════════════
-- Vérification d'identité vendeurs marketplace
-- À appliquer dans Supabase SQL Editor + créer bucket 'identity-docs'
-- privé manuellement dans Storage (Public OFF) AVANT d'exécuter les
-- policies si elles ne se créent pas en auto.
-- ════════════════════════════════════════════════════════════════════

-- 1. Colonnes profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS identity_doc_type text
    CHECK (identity_doc_type IN ('cni','passeport','titre_sejour')),
  ADD COLUMN IF NOT EXISTS identity_doc_recto_path text,
  ADD COLUMN IF NOT EXISTS identity_doc_verso_path text,
  ADD COLUMN IF NOT EXISTS identity_uploaded_at timestamptz,
  ADD COLUMN IF NOT EXISTS identity_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS identity_verified_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS identity_rejection_reason text;

CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified);

-- 2. Bucket storage 'identity-docs' (privé)
INSERT INTO storage.buckets (id, name, public)
VALUES ('identity-docs', 'identity-docs', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Policies bucket (INSERT / SELECT / UPDATE / DELETE par owner + SELECT admin)
DROP POLICY IF EXISTS "User uploads own identity" ON storage.objects;
CREATE POLICY "User uploads own identity"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "User reads own identity" ON storage.objects;
CREATE POLICY "User reads own identity"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "User updates own identity" ON storage.objects;
CREATE POLICY "User updates own identity"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "User deletes own identity" ON storage.objects;
CREATE POLICY "User deletes own identity"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admin reads all identity" ON storage.objects;
CREATE POLICY "Admin reads all identity"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'identity-docs'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 4. Défense en profondeur — trigger sur marketplace_proposals
-- Empêche INSERT si le vendeur n'est pas vérifié.
-- marketplace_proposals = propositions de vente (côté vendeur)
-- marketplace_requests = recherches (côté acheteur, pas concernée)
CREATE OR REPLACE FUNCTION marketplace_proposals_require_verified()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_verified boolean;
BEGIN
  SELECT is_verified INTO v_verified FROM profiles WHERE id = NEW.seller_id;
  IF v_verified IS NOT TRUE THEN
    RAISE EXCEPTION 'SELLER_NOT_VERIFIED: identity verification required to create marketplace proposal'
      USING HINT = 'Ask user to complete identity verification in /dashboard#profil';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_marketplace_proposals_require_verified ON marketplace_proposals;
CREATE TRIGGER trg_marketplace_proposals_require_verified
  BEFORE INSERT ON marketplace_proposals
  FOR EACH ROW
  EXECUTE FUNCTION marketplace_proposals_require_verified();
