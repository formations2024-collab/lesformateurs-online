-- ════════════════════════════════════════════════════════════════════
-- Marketplace - Preuves par critère (criteria_proofs)
-- Refonte : plus de bloc "Vérification LFO" binaire, mais des preuves
-- critère par critère stockées dans JSONB.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE marketplace_proposals
  ADD COLUMN IF NOT EXISTS criteria_proofs jsonb DEFAULT '{}'::jsonb;

-- wants_verification / verification_requested : on garde la colonne
-- pour compat legacy mais le front ne l'écrit plus.
COMMENT ON COLUMN marketplace_proposals.criteria_proofs IS
  'Preuves uploadées par critère. Format : { "nda": { "verified": true, "files": [{path,filename,uploaded_at}] }, "qualiopi": {...}, ... }. Le flag verified passe à true dès qu''au moins 1 fichier est uploadé. Files stockés dans bucket marketplace sous marketplace/proofs/{user_id}/{proposal_id}/{criterion}_{timestamp}.{ext}';
