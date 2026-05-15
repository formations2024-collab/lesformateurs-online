-- Migration : activer le type de démarche "formation_elus"
-- À exécuter dans Supabase SQL editor.
INSERT INTO service_status (type, category, active)
VALUES ('formation_elus', 'demarche', true)
ON CONFLICT DO NOTHING;
