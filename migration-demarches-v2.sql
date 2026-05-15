-- Migration démarches v2 : ajoute colonnes manquantes pour UI unifiée
-- Safe à exécuter plusieurs fois (IF NOT EXISTS)

ALTER TABLE demarches ADD COLUMN IF NOT EXISTS selected_options JSONB DEFAULT '[]'::jsonb;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS base_price_cents INT;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS payment_mode TEXT;
ALTER TABLE demarches ADD COLUMN IF NOT EXISTS total_steps INT DEFAULT 5;

ALTER TABLE demarche_documents ADD COLUMN IF NOT EXISTS comment TEXT;

-- Bucket Storage attendu : 'demarches' (à créer via Supabase UI avec policies appropriées)
