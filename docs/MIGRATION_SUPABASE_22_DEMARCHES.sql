-- =====================================================================
-- LFO — Migration 17/04/2026 — Spécifications 22 démarches finalisées
-- À exécuter dans Supabase SQL Editor (https://supabase.com/dashboard/project/bxijjjbxsevnudienvbv/sql)
-- 
-- Ordre d'exécution :
--   1. Bloc 1 : ALTER TABLE existantes
--   2. Bloc 2 : CREATE TABLE nouvelles
--   3. Bloc 3 : Seed données
--   4. Bloc 4 : RLS + triggers
--   5. Bloc 5 : Vues utiles
-- =====================================================================


-- =====================================================================
-- BLOC 1 — ALTER TABLE existantes
-- =====================================================================

-- 1.1 Table demarches : ajout des colonnes manquantes
ALTER TABLE demarches
  ADD COLUMN IF NOT EXISTS payment_mode TEXT DEFAULT 'comptant',
  ADD COLUMN IF NOT EXISTS installments_paid INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS installments_total INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS installment_amount_cents INT,
  ADD COLUMN IF NOT EXISTS parent_demarche_id UUID REFERENCES demarches(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mode_accompagnement TEXT,
  ADD COLUMN IF NOT EXISTS rdv_expert_id UUID,
  ADD COLUMN IF NOT EXISTS rdv_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rdv_url TEXT;

ALTER TABLE demarches DROP CONSTRAINT IF EXISTS demarches_payment_mode_check;
ALTER TABLE demarches ADD CONSTRAINT demarches_payment_mode_check
  CHECK (payment_mode IN ('comptant', '2x', '3x', 'devis', 'hors_site'));

ALTER TABLE demarches DROP CONSTRAINT IF EXISTS demarches_mode_accompagnement_check;
ALTER TABLE demarches ADD CONSTRAINT demarches_mode_accompagnement_check
  CHECK (mode_accompagnement IS NULL OR mode_accompagnement IN ('visio', 'email'));

-- 1.2 Index pour performances
CREATE INDEX IF NOT EXISTS idx_demarches_parent ON demarches(parent_demarche_id);
CREATE INDEX IF NOT EXISTS idx_demarches_user_status ON demarches(user_id, status);
CREATE INDEX IF NOT EXISTS idx_demarches_expert ON demarches(assigned_expert_id);
CREATE INDEX IF NOT EXISTS idx_demarches_type ON demarches(type);

-- 1.3 Table user_organismes : badges Qualiopi/NDA/EDOF/UAI
ALTER TABLE user_organismes
  ADD COLUMN IF NOT EXISTS nda BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS qualiopi BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS edof BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS uai TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 1.4 Table demarche_documents : workflow expert/client/admin
ALTER TABLE demarche_documents
  ADD COLUMN IF NOT EXISTS from_role TEXT DEFAULT 'client',
  ADD COLUMN IF NOT EXISTS step_index INT,
  ADD COLUMN IF NOT EXISTS required BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ;

ALTER TABLE demarche_documents DROP CONSTRAINT IF EXISTS demarche_documents_from_role_check;
ALTER TABLE demarche_documents ADD CONSTRAINT demarche_documents_from_role_check
  CHECK (from_role IN ('client', 'expert', 'admin'));


-- =====================================================================
-- BLOC 2 — CREATE TABLE nouvelles
-- =====================================================================

-- 2.1 Catalogue des 22 types de démarches (référence)
CREATE TABLE IF NOT EXISTS demarche_types (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_price_cents INT NOT NULL,
  payment_modes TEXT[] NOT NULL DEFAULT ARRAY['comptant'],
  steps_count INT NOT NULL,
  has_chatbot_ia BOOLEAN DEFAULT FALSE,
  has_accompagnement_choice BOOLEAN DEFAULT FALSE,
  is_pack BOOLEAN DEFAULT FALSE,
  is_dynamic_pricing BOOLEAN DEFAULT FALSE,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL,
  color_bar TEXT,
  color_bg TEXT,
  color_tx TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demarche_types_category ON demarche_types(category);
CREATE INDEX IF NOT EXISTS idx_demarche_types_order ON demarche_types(display_order);

-- 2.2 Experts LFO disponibles pour RDV
CREATE TABLE IF NOT EXISTS lfo_experts (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  speciality TEXT,
  bio TEXT,
  avatar_url TEXT,
  cal_com_url TEXT,
  email TEXT,
  color TEXT DEFAULT '#534AB7',
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2.3 RDV pris par les utilisateurs
CREATE TABLE IF NOT EXISTS demarche_rdvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demarche_id UUID REFERENCES demarches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  expert_id TEXT NOT NULL REFERENCES lfo_experts(id),
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  cal_com_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rdvs_user ON demarche_rdvs(user_id);
CREATE INDEX IF NOT EXISTS idx_rdvs_expert ON demarche_rdvs(expert_id);
CREATE INDEX IF NOT EXISTS idx_rdvs_demarche ON demarche_rdvs(demarche_id);

-- 2.4 Tranches de paiement détaillées
CREATE TABLE IF NOT EXISTS demarche_installments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demarche_id UUID NOT NULL REFERENCES demarches(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount_cents INT NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(demarche_id, installment_number)
);

CREATE INDEX IF NOT EXISTS idx_installments_demarche ON demarche_installments(demarche_id);


-- =====================================================================
-- BLOC 3 — SEED des données
-- =====================================================================

-- 3.1 Seed des 22 types de démarches
INSERT INTO demarche_types (id, category, name, description, base_price_cents, payment_modes, steps_count, has_chatbot_ia, has_accompagnement_choice, is_pack, is_dynamic_pricing, prerequisites, options, steps, color_bar, color_bg, color_tx, display_order)
VALUES
  -- Démarrer mon activité
  ('nda', 'Démarrer mon activité', 'NDA', 'Numéro de Déclaration d''Activité auprès de la DREETS', 29000, ARRAY['comptant','2x'], 4, TRUE, FALSE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"formateur","n":"Formateur habilité LFO","p":22000,"d":"Si pas de formateur"}]'::jsonb,
    '["Configuration","Dépôt dossier","Réception courrier","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',1),

  ('creation_of', 'Démarrer mon activité', 'Création OF', 'Création complète de votre organisme de formation (statuts, NDA, Qualiopi)', 149000, ARRAY['comptant','3x'], 6, FALSE, FALSE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"bilan","n":"Bilan de compétences","p":49000},{"k":"vae","n":"VAE","p":49000},{"k":"formateur","n":"Formateur LFO","p":22000},{"k":"kbis_existant","n":"Kbis existant","p":-10000}]'::jsonb,
    '["Configuration","Kbis","NDA","Qualiopi","Options annexes","Terminée"]'::jsonb,
    '#D85A30','#FAECE7','#993C1D',2),

  ('creation_formation', 'Démarrer mon activité', 'Création formation', 'Une formation complète avec 5 modules (programme, slides, quiz, vidéos)', 99000, ARRAY['comptant','3x'], 5, FALSE, FALSE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"module_sup","n":"Module supplémentaire","p":29000,"per":"unit"},{"k":"video_pro","n":"Vidéos complètes (tournage pro)","p":800000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Création formation","Vérif formateur","Validation client","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',3),

  ('edof', 'Démarrer mon activité', 'EDOF', 'Référencement Mon Compte Formation pour accéder au CPF', 49000, ARRAY['comptant','2x'], 5, TRUE, FALSE, FALSE, FALSE,
    '[{"need":"qualiopi","blocking":true},{"need":"nda","blocking":true}]'::jsonb,
    '[{"k":"formateur_sup","n":"Formateur supplémentaire","p":19000,"per":"unit"},{"k":"site","n":"Site internet","p":99000}]'::jsonb,
    '["Configuration","Formulaire","Dépôt","Webinaire","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',4),

  ('qualiopi', 'Démarrer mon activité', 'Qualiopi', 'Certification qualité obligatoire avec génération des 32 indicateurs', 99000, ARRAY['comptant','3x'], 4, TRUE, FALSE, FALSE, FALSE,
    '[{"need":"nda","blocking":true}]'::jsonb,
    '[{"k":"referent_audit","n":"Référent qualité jour audit","p":49000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Préparation","Audit","Terminée"]'::jsonb,
    '#1D9E75','#E1F5EE','#085041',5),

  ('opco', 'Démarrer mon activité', 'OPCO', 'Référencement OPCO (290€ par OPCO ciblé)', 29000, ARRAY['comptant','2x'], 3, FALSE, TRUE, FALSE, TRUE,
    '[{"need":"qualiopi","blocking":true},{"need":"nda","blocking":true}]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","RDV expert","Terminée"]'::jsonb,
    '#1D9E75','#E1F5EE','#085041',6),

  ('france_travail', 'Démarrer mon activité', 'France Travail', 'Référencement KAIROS pour les demandeurs d''emploi', 29000, ARRAY['comptant','2x'], 3, FALSE, TRUE, FALSE, FALSE,
    '[{"need":"qualiopi","blocking":true},{"need":"nda","blocking":true}]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","RDV expert","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',7),

  -- Niches spécialisées
  ('controle', 'Niches spécialisées', 'Contrôle', 'Mise en conformité suite à un contrôle DREETS (réactif ou anticipé)', 89000, ARRAY['comptant','3x'], 4, FALSE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","RDV + diag","Conformité","Terminée"]'::jsonb,
    '#E24B4A','#FCEBEB','#791F1F',8),

  ('uai', 'Niches spécialisées', 'UAI', 'Numéro UAI auprès du rectorat (formations RS/RNCP)', 14900, ARRAY['comptant'], 3, TRUE, TRUE, FALSE, FALSE,
    '[{"need":"nda","blocking":true}]'::jsonb,
    '[]'::jsonb,
    '["Configuration","Dépôt","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',9),

  ('centre_examen', 'Niches spécialisées', 'Centre examen', 'Devenir centre d''examen agréé pour des certifications', 199000, ARRAY['comptant','3x'], 5, TRUE, TRUE, FALSE, FALSE,
    '[{"need":"qualiopi","blocking":true}]'::jsonb,
    '[{"k":"expert_inspection","n":"Expert LFO présent inspection","p":49000},{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Audit locaux","Dépôt","Inspection","Terminée"]'::jsonb,
    '#E24B4A','#FCEBEB','#791F1F',10),

  ('agrement_prefectoral', 'Niches spécialisées', 'Agrément préfectoral', 'Agrément préfectoral (auto-école, SSIAP, CACES…)', 69000, ARRAY['comptant','3x'], 4, TRUE, TRUE, FALSE, FALSE,
    '[]'::jsonb,
    '[{"k":"formateurs_spe","n":"Formateurs spécifiques LFO","p":45000},{"k":"expert_inspection","n":"Expert présent inspection","p":49000}]'::jsonb,
    '["Configuration","Dépôt","Inspection préf.","Terminée"]'::jsonb,
    '#BA7517','#FAEEDA','#633806',11),

  ('formation_elus', 'Niches spécialisées', 'Formation élus', 'Agrément CNFEL pour la formation des élus locaux', 150000, ARRAY['comptant','3x'], 5, TRUE, TRUE, FALSE, FALSE,
    '[{"need":"qualiopi","blocking":true},{"need":"nda","blocking":true}]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Préparation","Dépôt préf.","Commission CNFEL","Terminée"]'::jsonb,
    '#E24B4A','#FCEBEB','#791F1F',12),

  ('habilitation', 'Niches spécialisées', 'Habilitation', 'Être habilité par un certificateur à délivrer une certification', 49000, ARRAY['comptant','2x'], 5, TRUE, TRUE, FALSE, FALSE,
    '[{"need":"qualiopi","blocking":true}]'::jsonb,
    '[{"k":"formateur","n":"Formateur LFO","p":22000}]'::jsonb,
    '["Configuration","Analyse + recherche","Paiement comp.","Constitution","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',13),

  ('centre_certifie', 'Niches spécialisées', 'Centre certifié', 'Devenir certificateur enregistré auprès de France Compétences', 599000, ARRAY['3x'], 5, TRUE, TRUE, FALSE, TRUE,
    '[{"need":"qualiopi","blocking":true}]'::jsonb,
    '[]'::jsonb,
    '["Configuration","Cadrage","Constitution","Dépôt FC","Commission"]'::jsonb,
    '#D85A30','#FAECE7','#993C1D',14),

  -- Packs
  ('pack_presence', 'Packs', 'Pack Présence', 'Site vitrine + documents légaux + livret d''accueil', 99000, ARRAY['comptant','3x'], 4, FALSE, TRUE, TRUE, FALSE,
    '[]'::jsonb,
    '[]'::jsonb,
    '["Configuration","Production","Révision","Terminée"]'::jsonb,
    '#1D9E75','#E1F5EE','#085041',15),

  ('pack_digital', 'Packs', 'Pack Digital', 'Présence + LMS + 3 formations + quizz + émargement', 299000, ARRAY['comptant','3x'], 4, FALSE, TRUE, TRUE, FALSE,
    '[]'::jsonb,
    '[]'::jsonb,
    '["Configuration","Production","Révision","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',16),

  ('pack_premium', 'Packs', 'Pack Premium', 'Digital + 1 agent IA configuré', 499000, ARRAY['comptant','3x'], 4, FALSE, TRUE, TRUE, FALSE,
    '[]'::jsonb,
    '[]'::jsonb,
    '["Configuration","Production","Révision","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',17),

  ('pack_enterprise', 'Packs', 'Pack Enterprise', 'Premium + app mobile + agents IA multiples', 799000, ARRAY['comptant','3x'], 4, FALSE, TRUE, TRUE, FALSE,
    '[]'::jsonb,
    '[{"k":"agent_sup","n":"Agent IA supplémentaire","p":39000,"per":"unit"}]'::jsonb,
    '["Configuration","Production","Révision","Terminée"]'::jsonb,
    '#1a1a1a','#F1EFE8','#444441',18),

  -- Développer mon organisme (services)
  ('site', 'Développer mon organisme', 'Site internet', 'Site internet professionnel pour votre organisme', 99000, ARRAY['comptant','3x'], 5, FALSE, TRUE, FALSE, TRUE,
    '[]'::jsonb,
    '[{"k":"blog_seo","n":"Blog + SEO","p":49000},{"k":"ecommerce","n":"E-commerce","p":150000},{"k":"multilingue","n":"Multilingue","p":49000}]'::jsonb,
    '["Configuration","Design","Production","Sécurité","Terminée"]'::jsonb,
    '#D85A30','#FAECE7','#993C1D',19),

  ('app', 'Développer mon organisme', 'App mobile', 'Application mobile iOS et/ou Android', 499000, ARRAY['comptant','3x'], 5, FALSE, TRUE, FALSE, TRUE,
    '[]'::jsonb,
    '[{"k":"ios_android","n":"iOS + Android","p":200000},{"k":"stores","n":"Publication stores","p":49000},{"k":"push","n":"Push + messagerie","p":99000}]'::jsonb,
    '["Configuration","Design","Production","Sécurité","Terminée"]'::jsonb,
    '#7F77DD','#EEEDFE','#3C3489',20),

  ('lms', 'Développer mon organisme', 'LMS', 'Plateforme e-learning pour vos apprenants', 290000, ARRAY['comptant','3x'], 5, FALSE, TRUE, FALSE, TRUE,
    '[]'::jsonb,
    '[{"k":"scale_500","n":"50-500 apprenants","p":150000},{"k":"scale_500p","n":"500+ apprenants","p":300000},{"k":"cpf_edof","n":"Intégration CPF/EDOF","p":99000},{"k":"app_app","n":"App mobile apprenant","p":199000}]'::jsonb,
    '["Configuration","Design","Production","Sécurité","Terminée"]'::jsonb,
    '#1D9E75','#E1F5EE','#085041',21),

  ('agent_ia', 'Développer mon organisme', 'Agent IA', 'Agents IA pour automatiser vos tâches (390€/agent)', 39000, ARRAY['comptant','2x'], 4, FALSE, TRUE, FALSE, TRUE,
    '[]'::jsonb,
    '[]'::jsonb,
    '["Configuration","RDV expert","Production","Terminée"]'::jsonb,
    '#378ADD','#E6F1FB','#0C447C',22)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price_cents = EXCLUDED.base_price_cents,
  payment_modes = EXCLUDED.payment_modes,
  steps_count = EXCLUDED.steps_count,
  has_chatbot_ia = EXCLUDED.has_chatbot_ia,
  has_accompagnement_choice = EXCLUDED.has_accompagnement_choice,
  is_pack = EXCLUDED.is_pack,
  is_dynamic_pricing = EXCLUDED.is_dynamic_pricing,
  prerequisites = EXCLUDED.prerequisites,
  options = EXCLUDED.options,
  steps = EXCLUDED.steps,
  color_bar = EXCLUDED.color_bar,
  color_bg = EXCLUDED.color_bg,
  color_tx = EXCLUDED.color_tx,
  display_order = EXCLUDED.display_order;


-- 3.2 Seed des 4 experts LFO
INSERT INTO lfo_experts (id, full_name, role, speciality, bio, cal_com_url, color, display_order)
VALUES
  ('yohann', 'Yohann', 'Founder LFO', 'Stratégie OF, EDOF, Qualiopi',
    'Founder de LesFormateurs.online. Expert stratégie pour les organismes de formation, accompagne les OF dans leur développement.',
    'https://cal.com/yohann-lfo/30min', '#D85A30', 1),

  ('laurent', 'Laurent', 'Expert formation', 'Création OF, NDA, OPCO, France Travail',
    'Spécialisé dans le démarrage d''organismes de formation et le référencement auprès des financeurs.',
    'https://cal.com/laurent-lfo/30min', '#7F77DD', 2),

  ('karim', 'Karim', 'Expert tech', 'Site, App, LMS, Agent IA',
    'Expert technique pour les services digitaux : site web, application mobile, LMS et automatisation IA.',
    'https://cal.com/karim-lfo/30min', '#378ADD', 3),

  ('marie', 'Marie', 'Expert certifications', 'Centre certifié, RNCP, RS, France Compétences',
    'Spécialiste des dossiers France Compétences pour devenir centre certificateur.',
    'https://cal.com/marie-lfo/30min', '#1D9E75', 4)

ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  speciality = EXCLUDED.speciality,
  bio = EXCLUDED.bio,
  cal_com_url = EXCLUDED.cal_com_url,
  color = EXCLUDED.color;


-- =====================================================================
-- BLOC 4 — RLS + TRIGGERS
-- =====================================================================

-- 4.1 Trigger : empêcher le client de revenir en arrière
CREATE OR REPLACE FUNCTION prevent_client_step_regression()
RETURNS TRIGGER AS $$
BEGIN
  -- Seul un admin (is_admin) ou expert (is_pro) peut faire reculer une étape
  IF OLD.current_step > NEW.current_step THEN
    IF NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (is_admin = TRUE OR is_pro = TRUE)
    ) THEN
      RAISE EXCEPTION 'Seul un admin ou expert peut revenir à une étape précédente';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_regression ON demarches;
CREATE TRIGGER prevent_regression
  BEFORE UPDATE ON demarches
  FOR EACH ROW
  WHEN (OLD.current_step IS DISTINCT FROM NEW.current_step)
  EXECUTE FUNCTION prevent_client_step_regression();

-- 4.2 Trigger : empêcher passage à l'étape suivante si tranche non payée
CREATE OR REPLACE FUNCTION check_payment_before_step()
RETURNS TRIGGER AS $$
BEGIN
  -- Si on avance d'étape ET paiement échelonné (pas comptant)
  IF NEW.current_step > OLD.current_step
     AND NEW.payment_mode IN ('2x', '3x')
     AND NEW.installments_paid < NEW.current_step THEN
    -- L'admin peut bypass (pour les paiements hors-site)
    IF NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    ) THEN
      RAISE EXCEPTION 'Tranche % non payée, impossible de passer à l''étape %',
        NEW.current_step, NEW.current_step + 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_payment_step ON demarches;
CREATE TRIGGER check_payment_step
  BEFORE UPDATE ON demarches
  FOR EACH ROW
  WHEN (OLD.current_step IS DISTINCT FROM NEW.current_step)
  EXECUTE FUNCTION check_payment_before_step();

-- 4.3 Trigger : empêcher l'annulation par le client après l'étape 2
CREATE OR REPLACE FUNCTION check_cancellation_rights()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'annule' AND OLD.status != 'annule' THEN
    -- Si étape > 2, seul l'admin peut annuler
    IF OLD.current_step > 2 THEN
      IF NOT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND is_admin = TRUE
      ) THEN
        RAISE EXCEPTION 'Annulation impossible après l''étape 2 — contactez un administrateur';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_cancellation ON demarches;
CREATE TRIGGER check_cancellation
  BEFORE UPDATE ON demarches
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION check_cancellation_rights();

-- 4.4 RLS sur les nouvelles tables
ALTER TABLE demarche_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "demarche_types_select_all" ON demarche_types;
CREATE POLICY "demarche_types_select_all" ON demarche_types
  FOR SELECT USING (active = TRUE);

ALTER TABLE lfo_experts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "lfo_experts_select_all" ON lfo_experts;
CREATE POLICY "lfo_experts_select_all" ON lfo_experts
  FOR SELECT USING (active = TRUE);

ALTER TABLE demarche_rdvs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rdvs_user_own" ON demarche_rdvs;
CREATE POLICY "rdvs_user_own" ON demarche_rdvs
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND (is_admin = TRUE OR is_pro = TRUE))
  );

ALTER TABLE demarche_installments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "installments_visible" ON demarche_installments;
CREATE POLICY "installments_visible" ON demarche_installments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM demarches d
      WHERE d.id = demarche_installments.demarche_id
        AND (d.user_id = auth.uid()
             OR d.assigned_expert_id = auth.uid()
             OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE))
    )
  );


-- =====================================================================
-- BLOC 5 — VUES UTILES
-- =====================================================================

-- 5.1 Vue admin : démarches enrichies
CREATE OR REPLACE VIEW v_demarches_admin AS
SELECT
  d.id,
  d.type,
  dt.name AS type_name,
  dt.category AS type_category,
  d.status,
  d.current_step,
  d.total_steps,
  dt.steps AS steps_list,
  d.amount_cents,
  d.paid,
  d.payment_mode,
  d.installments_paid,
  d.installments_total,
  d.created_at,
  d.updated_at,
  d.user_id,
  p.first_name || ' ' || p.last_name AS user_name,
  p.email AS user_email,
  uo.siren,
  uo.raison_sociale,
  uo.qualiopi,
  uo.nda,
  uo.edof,
  d.assigned_expert_id,
  ep.first_name || ' ' || ep.last_name AS expert_name,
  d.parent_demarche_id,
  d.created_by_admin,
  d.config,
  d.options
FROM demarches d
LEFT JOIN profiles p ON p.id = d.user_id
LEFT JOIN demarche_types dt ON dt.id = d.type
LEFT JOIN user_organismes uo ON uo.id = d.organisme_id
LEFT JOIN profiles ep ON ep.id = d.assigned_expert_id;

-- 5.2 Vue expert : seulement les démarches assignées
CREATE OR REPLACE VIEW v_demarches_expert AS
SELECT * FROM v_demarches_admin
WHERE assigned_expert_id = auth.uid();

-- 5.3 Vue user : seulement ses démarches
CREATE OR REPLACE VIEW v_demarches_user AS
SELECT
  id, type, type_name, type_category, status,
  current_step, total_steps, steps_list,
  amount_cents, paid, payment_mode,
  installments_paid, installments_total,
  created_at, updated_at,
  expert_name, parent_demarche_id, config, options
FROM v_demarches_admin
WHERE user_id = auth.uid();


-- =====================================================================
-- BLOC 6 — FONCTIONS HELPERS
-- =====================================================================

-- 6.1 Fonction : créer les tranches de paiement automatiquement
CREATE OR REPLACE FUNCTION create_installments_for_demarche(p_demarche_id UUID)
RETURNS VOID AS $$
DECLARE
  v_demarche RECORD;
  v_installment_amount INT;
  v_i INT;
BEGIN
  SELECT amount_cents, payment_mode, installments_total
  INTO v_demarche
  FROM demarches
  WHERE id = p_demarche_id;

  IF v_demarche.payment_mode IN ('2x', '3x') THEN
    v_installment_amount := v_demarche.amount_cents / v_demarche.installments_total;

    -- Supprimer anciennes tranches éventuelles
    DELETE FROM demarche_installments WHERE demarche_id = p_demarche_id;

    -- Créer N tranches
    FOR v_i IN 1..v_demarche.installments_total LOOP
      INSERT INTO demarche_installments (demarche_id, installment_number, amount_cents, due_date)
      VALUES (p_demarche_id, v_i, v_installment_amount, CURRENT_DATE + INTERVAL '1 month' * (v_i - 1));
    END LOOP;
  ELSE
    -- Comptant : 1 seule tranche
    DELETE FROM demarche_installments WHERE demarche_id = p_demarche_id;
    INSERT INTO demarche_installments (demarche_id, installment_number, amount_cents, due_date)
    VALUES (p_demarche_id, 1, v_demarche.amount_cents, CURRENT_DATE);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 6.2 Fonction : calculer prix total d'une démarche selon options
CREATE OR REPLACE FUNCTION calculate_demarche_price(p_type TEXT, p_options JSONB)
RETURNS INT AS $$
DECLARE
  v_base INT;
  v_options JSONB;
  v_total INT;
  v_opt JSONB;
  v_selected JSONB;
BEGIN
  SELECT base_price_cents, options INTO v_base, v_options
  FROM demarche_types WHERE id = p_type;

  v_total := v_base;

  -- Itérer sur les options sélectionnées
  FOR v_selected IN SELECT * FROM jsonb_array_elements(p_options) LOOP
    FOR v_opt IN SELECT * FROM jsonb_array_elements(v_options) LOOP
      IF v_opt->>'k' = v_selected->>'k' THEN
        v_total := v_total + (v_opt->>'p')::INT * COALESCE((v_selected->>'count')::INT, 1);
      END IF;
    END LOOP;
  END LOOP;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- 6.3 Trigger : auto-générer tranches à la création d'une démarche
CREATE OR REPLACE FUNCTION auto_create_installments()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_mode IS NOT NULL THEN
    PERFORM create_installments_for_demarche(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_installments ON demarches;
CREATE TRIGGER auto_installments
  AFTER INSERT ON demarches
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_installments();


-- =====================================================================
-- VÉRIFICATIONS POST-MIGRATION
-- =====================================================================

-- À exécuter après pour vérifier que tout est OK :
-- SELECT id, name, base_price_cents/100 AS prix_eur, steps_count FROM demarche_types ORDER BY display_order;
-- SELECT id, full_name, role, speciality FROM lfo_experts ORDER BY display_order;
-- SELECT count(*) FROM demarche_types;  -- doit retourner 22
-- SELECT count(*) FROM lfo_experts;     -- doit retourner 4

COMMENT ON TABLE demarche_types IS 'Catalogue de référence des 22 démarches LFO';
COMMENT ON TABLE lfo_experts IS 'Experts LFO disponibles pour RDV utilisateur';
COMMENT ON TABLE demarche_rdvs IS 'RDV pris par les utilisateurs avec un expert LFO';
COMMENT ON TABLE demarche_installments IS 'Tranches de paiement pour démarches en 2x/3x';
