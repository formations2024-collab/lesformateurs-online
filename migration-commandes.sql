-- ═══════════════════════════════════════════════════════════════════════
-- MIGRATION : Table `commandes` (services digitaux) + `commande_documents`
-- À appliquer dans l'éditeur SQL Supabase
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS commandes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  current_step INT DEFAULT 1,
  total_steps INT DEFAULT 5,
  amount_cents INT,
  base_price_cents INT,
  paid BOOLEAN DEFAULT FALSE,
  payment_mode TEXT,
  selected_options JSONB DEFAULT '[]'::jsonb,
  assigned_expert_id UUID REFERENCES profiles(id),
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  organisme_id UUID,
  org_name TEXT,
  form_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE commandes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own commandes" ON commandes;
CREATE POLICY "Users see own commandes" ON commandes FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = assigned_expert_id
         OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Users insert own commandes" ON commandes;
CREATE POLICY "Users insert own commandes" ON commandes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Update own or assigned or admin" ON commandes;
CREATE POLICY "Update own or assigned or admin" ON commandes FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = assigned_expert_id
         OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

DROP POLICY IF EXISTS "Admin delete" ON commandes;
CREATE POLICY "Admin delete" ON commandes FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ─── Documents liés aux commandes (mêmes colonnes que demarche_documents) ───
CREATE TABLE IF NOT EXISTS commande_documents (LIKE demarche_documents INCLUDING ALL);
ALTER TABLE commande_documents ADD COLUMN IF NOT EXISTS commande_id UUID REFERENCES commandes(id) ON DELETE CASCADE;
ALTER TABLE commande_documents DROP COLUMN IF EXISTS demarche_id;

ALTER TABLE commande_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cd select" ON commande_documents;
CREATE POLICY "cd select" ON commande_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM commandes c WHERE c.id = commande_documents.commande_id
          AND (c.user_id = auth.uid() OR c.assigned_expert_id = auth.uid()
               OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)))
);
DROP POLICY IF EXISTS "cd insert" ON commande_documents;
CREATE POLICY "cd insert" ON commande_documents FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM commandes c WHERE c.id = commande_documents.commande_id
          AND (c.user_id = auth.uid() OR c.assigned_expert_id = auth.uid()
               OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)))
);
DROP POLICY IF EXISTS "cd update" ON commande_documents;
CREATE POLICY "cd update" ON commande_documents FOR UPDATE USING (
  EXISTS (SELECT 1 FROM commandes c WHERE c.id = commande_documents.commande_id
          AND (c.user_id = auth.uid() OR c.assigned_expert_id = auth.uid()
               OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)))
);
DROP POLICY IF EXISTS "cd delete" ON commande_documents;
CREATE POLICY "cd delete" ON commande_documents FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ─── Messagerie : ajouter commande_id ───
ALTER TABLE messages ADD COLUMN IF NOT EXISTS commande_id UUID REFERENCES commandes(id) ON DELETE CASCADE;

-- ─── Storage bucket (à créer manuellement via UI Supabase si absent) ───
-- Nom : `commandes` (privé). Policies identiques au bucket `demarches`.
-- Fallback utilisé par le code : si bucket `commandes` absent, reprend `demarches` avec préfixe `cmd_`.
