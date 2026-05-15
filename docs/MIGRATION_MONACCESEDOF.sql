-- Migration monaccesedof → demarche_types + demarche_forms + demarche_form_fields
-- A executer dans Supabase SQL Editor

INSERT INTO demarche_types
(id, category, name, description, base_price_cents, payment_modes, steps_count, has_chatbot_ia, has_accompagnement_choice, is_pack, is_dynamic_pricing, prerequisites, options, steps, color_bar, color_bg, color_tx, display_order, active)
VALUES (
  'monaccesedof',
  'Démarrer mon activité',
  'Mon Accès EDOF (funnel public)',
  'Accès EDOF avec habilitations RS/RNCP et site internet optionnels — version funnel public sur /monaccesedof',
  49000,
  ARRAY['comptant','2x','3x','virement'],
  5,
  FALSE, FALSE, FALSE, TRUE,
  '[]'::jsonb,
  '[{"k":"habilitation","n":"Habilitation RS/RNCP","p":99000,"per":"unit","d":"990 EUR par habilitation"},{"k":"site","n":"Site internet","p":99000,"d":"990 EUR — site vitrine pro"}]'::jsonb,
  '["Identification","Types de formations","Site internet","Compte","Paiement"]'::jsonb,
  '#D85A30','#FAECE7','#993C1D', 100, TRUE
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description,
  base_price_cents = EXCLUDED.base_price_cents, payment_modes = EXCLUDED.payment_modes,
  options = EXCLUDED.options, steps = EXCLUDED.steps;

-- Formulaire associe
INSERT INTO demarche_forms (demarche_type_id, name, description, layout, submit_button_label, is_active)
VALUES (
  'monaccesedof',
  'Formulaire Mon Accès EDOF (public)',
  'Formulaire complet du funnel /monaccesedof',
  'multi_step',
  'Créer mon compte et finaliser la commande',
  TRUE
)
ON CONFLICT DO NOTHING;

-- Champs du formulaire
WITH f AS (SELECT id FROM demarche_forms WHERE demarche_type_id = 'monaccesedof' LIMIT 1)
INSERT INTO demarche_form_fields (form_id, field_key, label, field_type, display_order, is_required, options, section_title, help_text)
SELECT v.* FROM (VALUES
  ((SELECT id FROM f), 'email', 'Votre email', 'email', 10, TRUE, '[]'::jsonb, '1. Identification', 'Utilisez l''email lié à votre compte EFP Connect'),
  ((SELECT id FROM f), 'siret', 'SIRET de votre organisme', 'siret', 11, TRUE, '[]'::jsonb, NULL, 'Recherche automatique via API gouv'),
  ((SELECT id FROM f), 'types_formations', 'Types de formations EDOF', 'multiselect', 20, TRUE,
    '[{"value":"habilitation","label":"Habilitation RS/RNCP"},{"value":"certification","label":"Certification RS/RNCP"},{"value":"bilan","label":"Bilan de compétences"},{"value":"vae","label":"VAE"},{"value":"permis","label":"Permis de conduire"},{"value":"aucune","label":"Je n''ai aucune de ces formations"}]'::jsonb,
    '2. Types de formations', NULL),
  ((SELECT id FROM f), 'certifications_visees', 'Certifications visées', 'rs_rncp_picker', 21, FALSE, '[]'::jsonb, NULL, 'Recherche par code RS/RNCP ou intitulé'),
  ((SELECT id FROM f), 'site_status', 'Avez-vous un site internet ?', 'radio', 30, TRUE,
    '[{"value":"oui","label":"Oui"},{"value":"non","label":"Non"}]'::jsonb, '3. Site internet', NULL),
  ((SELECT id FROM f), 'site_url', 'URL de votre site', 'url', 31, FALSE, '[]'::jsonb, NULL, NULL),
  ((SELECT id FROM f), 'site_offer', 'Ajouter le site (+990 EUR)', 'toggle', 32, FALSE, '[]'::jsonb, NULL, NULL),
  ((SELECT id FROM f), 'first_name', 'Prénom', 'text', 40, TRUE, '[]'::jsonb, '4. Créer votre compte', NULL),
  ((SELECT id FROM f), 'last_name', 'Nom', 'text', 41, TRUE, '[]'::jsonb, NULL, NULL),
  ((SELECT id FROM f), 'phone', 'Téléphone', 'tel', 42, FALSE, '[]'::jsonb, NULL, NULL),
  ((SELECT id FROM f), 'password', 'Mot de passe', 'text', 43, TRUE, '[]'::jsonb, NULL, '8 caractères minimum'),
  ((SELECT id FROM f), 'payment_mode', 'Mode de paiement', 'radio', 50, TRUE,
    '[{"value":"comptant","label":"Comptant"},{"value":"2x","label":"2x sans frais"},{"value":"3x","label":"3x sans frais"},{"value":"virement","label":"Virement bancaire"}]'::jsonb,
    '5. Mode de paiement', NULL)
) AS v(form_id, field_key, label, field_type, display_order, is_required, options, section_title, help_text)
WHERE NOT EXISTS (
  SELECT 1 FROM demarche_form_fields ff WHERE ff.form_id = v.form_id AND ff.field_key = v.field_key
);

-- Verification
-- SELECT count(*) FROM demarche_types WHERE active = TRUE;  -- 28
-- SELECT count(*) FROM demarche_form_fields WHERE form_id = (SELECT id FROM demarche_forms WHERE demarche_type_id = 'monaccesedof');  -- 12
