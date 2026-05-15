-- ════════════════════════════════════════════════════════════════════
-- Démarches — extensions paiement (comptant / 2x / 3x) + lien Stripe
-- À exécuter dans Supabase SQL Editor.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE demarches
  ADD COLUMN IF NOT EXISTS payment_mode text
    CHECK (payment_mode IN ('comptant','2x','3x','devis')),
  ADD COLUMN IF NOT EXISTS installment_cents int,
  ADD COLUMN IF NOT EXISTS installments_paid int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS installments_total int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS organisme_id uuid REFERENCES user_organismes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS form_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_link_id text,
  ADD COLUMN IF NOT EXISTS stripe_product_id text,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_demarches_paid ON demarches(paid);
CREATE INDEX IF NOT EXISTS idx_demarches_payment_mode ON demarches(payment_mode);
CREATE INDEX IF NOT EXISTS idx_demarches_organisme ON demarches(organisme_id);

-- Les démarches existantes sans payment_mode sont considérées 'comptant' par défaut
UPDATE demarches SET payment_mode = 'comptant'
WHERE payment_mode IS NULL;

-- Normalise installments_total à 1 si null
UPDATE demarches SET installments_total = 1
WHERE installments_total IS NULL;

-- Le statut 'annule_user' est ajouté aux valeurs possibles (si le check existe)
-- Si la table a un CHECK constraint sur status, l'étendre ici selon vos besoins.
