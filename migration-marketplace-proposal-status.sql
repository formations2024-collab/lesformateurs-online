-- ════════════════════════════════════════════════════════════════════
-- Marketplace proposals — ajouter statut 'withdrawn' + harmoniser les
-- statuts autorisés.
-- ════════════════════════════════════════════════════════════════════

-- 1) Migrer les anciennes valeurs 'pending' → 'active' (cohérence)
UPDATE marketplace_proposals SET status = 'active' WHERE status = 'pending';

-- 2) Remplacer la contrainte CHECK
ALTER TABLE marketplace_proposals DROP CONSTRAINT IF EXISTS marketplace_proposals_status_check;
ALTER TABLE marketplace_proposals
  ADD CONSTRAINT marketplace_proposals_status_check
  CHECK (status IN ('active', 'accepted', 'rejected', 'withdrawn', 'expired'));

-- 3) Index sur status pour les filtres fréquents
CREATE INDEX IF NOT EXISTS idx_marketplace_proposals_status ON marketplace_proposals(status);
