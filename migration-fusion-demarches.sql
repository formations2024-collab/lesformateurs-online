-- Migration : fusion table `commandes` dans `demarches`
-- À appliquer manuellement dans Supabase SQL editor.
-- APRÈS application, toutes les démarches existantes seront `category='demarche'`,
-- et le JS du dashboard ajoutera `category='service'` pour toute nouvelle commande.

ALTER TABLE demarches ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'demarche';
UPDATE demarches SET category = 'demarche' WHERE category IS NULL;

ALTER TABLE messages DROP COLUMN IF EXISTS commande_id;

DROP TABLE IF EXISTS commande_documents CASCADE;
DROP TABLE IF EXISTS commandes CASCADE;
