-- =====================================================================
-- LFO — Migration Créer OF — 5 nouvelles démarches + mises à jour
-- À exécuter dans Supabase SQL Editor APRÈS MIGRATION_SUPABASE_22_DEMARCHES.sql
-- =====================================================================

-- 1. Nouvelles démarches
INSERT INTO demarche_types (id, category, name, description, base_price_cents, payment_modes, steps_count, has_chatbot_ia, has_accompagnement_choice, is_pack, is_dynamic_pricing, prerequisites, options, steps, color_bar, color_bg, color_tx, display_order)
VALUES
  ('creation_cfa', 'Démarrer mon activité', 'CFA Apprentissage', 'Création d''un CFA (Centre de Formation d''Apprentis) avec conventions et habilitations.', 299000, ARRAY['comptant','3x'], 6, FALSE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Kbis","NDA","CFA / UAI","Qualiopi","Terminée"]'::jsonb,
    '#D85A30','#FAECE7','#993C1D',23),

  ('creation_bilan', 'Démarrer mon activité', 'Bilan de compétences', 'Création d''un centre de Bilan de compétences avec programme et outils.', 199000, ARRAY['comptant','3x'], 6, FALSE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"vae","n":"Ajouter VAE (+500€)","p":50000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Kbis","NDA","Programme Bilan","Qualiopi","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',24),

  ('creation_vae', 'Démarrer mon activité', 'VAE', 'Création d''un centre d''accompagnement VAE avec méthodologie complète.', 199000, ARRAY['comptant','3x'], 6, FALSE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"bilan","n":"Ajouter Bilan (+500€)","p":50000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Kbis","NDA","Programme VAE","Qualiopi","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',25),

  ('creation_vae_bilan', 'Démarrer mon activité', 'VAE + Bilan', 'Centre combiné VAE + Bilan de compétences (tarif avantageux).', 249000, ARRAY['comptant','3x'], 6, FALSE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Kbis","NDA","Programmes VAE+Bilan","Qualiopi","Terminée"]'::jsonb,
    '#534AB7','#EEEDFE','#3C3489',26),

  ('creation_centre_online', 'Démarrer mon activité', 'Centre 100% en ligne', 'Organisme 100% digital avec LMS, agents IA et automatisation complète.', 299000, ARRAY['comptant','3x'], 6, FALSE, TRUE, FALSE, TRUE,
    '[]'::jsonb,
    '[{"k":"agent_sup","n":"Agent IA supplémentaire","p":39000,"per":"unit"},{"k":"opco","n":"Référencement OPCO","p":29000},{"k":"habilitation","n":"Habilitation RS/RNCP","p":49000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Kbis","NDA","LMS + Site","Qualiopi","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',27)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price_cents = EXCLUDED.base_price_cents,
  payment_modes = EXCLUDED.payment_modes,
  steps_count = EXCLUDED.steps_count,
  options = EXCLUDED.options,
  steps = EXCLUDED.steps,
  color_bar = EXCLUDED.color_bar,
  color_bg = EXCLUDED.color_bg,
  color_tx = EXCLUDED.color_tx,
  display_order = EXCLUDED.display_order;

-- 2. Mise à jour creation_of : options Bilan/VAE +1000���
UPDATE demarche_types SET options = '[
  {"k":"bilan","n":"Ajouter Bilan de compétences (+1 000€)","p":100000},
  {"k":"vae","n":"Ajouter VAE (+1 000€)","p":100000},
  {"k":"site","n":"Site internet vitrine","p":99000},
  {"k":"edof","n":"Référencement EDOF/CPF","p":49000},
  {"k":"opco","n":"Référencement OPCO","p":29000},
  {"k":"habilitation","n":"Habilitation RS/RNCP","p":49000},
  {"k":"agent_ia","n":"Agent IA","p":39000},
  {"k":"formateur","n":"Formateur LFO","p":22000},
  {"k":"kbis_existant","n":"Kbis déjà existant (-100€)","p":-10000}
]'::jsonb
WHERE id = 'creation_of';

-- 3. Mise à jour formation_elus : option "Créer un OF d'abord"
UPDATE demarche_types SET options = '[
  {"k":"creer_of","n":"Créer un OF d''abord (+1 490€)","p":149000},
  {"k":"formateur","n":"Formateur LFO","p":22000}
]'::jsonb
WHERE id = 'formation_elus';

-- Vérification
-- SELECT id, name, base_price_cents/100 AS prix_eur FROM demarche_types WHERE id IN ('creation_of','creation_cfa','creation_bilan','creation_vae','creation_vae_bilan','creation_centre_online','formation_elus') ORDER BY display_order;
-- SELECT count(*) FROM demarche_types WHERE active = TRUE; -- doit retourner 27
