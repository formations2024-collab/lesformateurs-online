-- Marketplace v2 : nouveaux champs pour le modal "Je cherche un centre"
-- Ajoute les colonnes criteria_wanted et criteria_excluded (JSONB arrays)

ALTER TABLE marketplace_requests ADD COLUMN IF NOT EXISTS criteria_wanted JSONB DEFAULT '[]'::jsonb;
ALTER TABLE marketplace_requests ADD COLUMN IF NOT EXISTS criteria_excluded JSONB DEFAULT '[]'::jsonb;
