-- ═══════════════════════════════════════════════════════════════════════
-- MIGRATION : Table `service_orders` (commandes de services techniques)
-- site / app / lms / agent_ia — gating paiement 3x + timeline
-- À appliquer dans l'éditeur SQL Supabase
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organisme_id UUID REFERENCES user_organismes(id) ON DELETE SET NULL,

  -- Service
  service_type TEXT NOT NULL CHECK (service_type IN ('site','app','lms','agent_ia')),
  service_label TEXT,

  -- Statut / étape workflow
  status TEXT NOT NULL DEFAULT 'configuration'
    CHECK (status IN ('configuration','en_attente_paiement','design','rdv_expert','production','securite','livre','annule')),
  current_step INT NOT NULL DEFAULT 1,
  total_steps INT NOT NULL DEFAULT 5,

  -- Paiement
  payment_mode TEXT NOT NULL DEFAULT 'comptant' CHECK (payment_mode IN ('comptant','3x')),
  total_cents INT NOT NULL,
  installment_cents INT,
  installments_total INT NOT NULL DEFAULT 1,
  installments_paid INT NOT NULL DEFAULT 0,

  -- Stripe
  stripe_checkout_session TEXT,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,

  -- Brief / métadonnées
  brief_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Assignation / suivi interne
  assigned_expert_id UUID REFERENCES profiles(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- ─── Index ───
CREATE INDEX IF NOT EXISTS idx_service_orders_user ON service_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_service_type ON service_orders(service_type);
CREATE INDEX IF NOT EXISTS idx_service_orders_organisme ON service_orders(organisme_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_expert ON service_orders(assigned_expert_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_created ON service_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_service_orders_session ON service_orders(stripe_checkout_session);

-- ─── Trigger updated_at ───
CREATE OR REPLACE FUNCTION service_orders_touch() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_service_orders_touch ON service_orders;
CREATE TRIGGER trg_service_orders_touch BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION service_orders_touch();

-- ─── RLS ───
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "so_select_own" ON service_orders;
CREATE POLICY "so_select_own" ON service_orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR auth.uid() = assigned_expert_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "so_insert_own" ON service_orders;
CREATE POLICY "so_insert_own" ON service_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "so_update_own_or_admin" ON service_orders;
CREATE POLICY "so_update_own_or_admin" ON service_orders FOR UPDATE
  USING (
    auth.uid() = user_id
    OR auth.uid() = assigned_expert_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

DROP POLICY IF EXISTS "so_delete_admin" ON service_orders;
CREATE POLICY "so_delete_admin" ON service_orders FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
