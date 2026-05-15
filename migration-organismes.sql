-- Migration : ajout des colonnes pour la rubrique "Mes organismes" (dashboard user)
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS site_internet TEXT;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_agents_ia BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_edof BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_rsrncp BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_centre_examen BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_uai BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS has_france_travail BOOLEAN DEFAULT FALSE;
ALTER TABLE user_organismes ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
