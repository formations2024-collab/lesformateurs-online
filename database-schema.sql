-- ============================================
-- lesformateurs.online — Schéma base de données
-- Supabase (PostgreSQL)
-- ============================================

-- ====== UTILISATEURS ======
-- (Supabase Auth gère l'authentification, cette table étend le profil)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  siren TEXT,
  profile_type TEXT CHECK (profile_type IN ('formateur', 'gerant_of', 'creation_of', 'demandeur_emploi', 'expert', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== DÉMARCHES CONFORMITÉ ======
CREATE TABLE demarches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nda', 'uai', 'qualiopi', 'edof', 'francetravail', 'rs_rncp', 'opco', 'bpf')),
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'verification_expert', 'soumis', 'termine', 'refuse')),
  current_step INT DEFAULT 1, -- 1 à 5
  amount_cents INT NOT NULL, -- prix en centimes
  stripe_payment_id TEXT,
  stripe_checkout_session TEXT,
  paid BOOLEAN DEFAULT FALSE,
  expert_id UUID REFERENCES profiles(id),
  expert_comment TEXT,
  -- Infos spécifiques au dossier
  org_name TEXT,
  siren TEXT,
  nda_number TEXT,
  metadata JSONB DEFAULT '{}', -- données supplémentaires selon le type
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== OPCO sélectionnés (pour les commandes OPCO) ======
CREATE TABLE demarche_opco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demarche_id UUID REFERENCES demarches(id) ON DELETE CASCADE,
  opco_name TEXT NOT NULL, -- AFDAS, ATLAS, UNIFORMATION, AKTO, OCAPIAT, OPCO2I, CONSTRUCTYS, OPCOMMERCE, MOBILITES, EP, SANTE
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_cours', 'valide', 'refuse')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== DOCUMENTS ======
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demarche_id UUID REFERENCES demarches(id) ON DELETE CASCADE,
  creation_of_id UUID, -- référence vers creations_of si c'est pour une création
  name TEXT NOT NULL, -- ex: "Convention_formation.pdf"
  file_path TEXT NOT NULL, -- chemin dans Supabase Storage
  file_size INT,
  mime_type TEXT,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'valide', 'refuse')),
  expert_comment TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== CRÉATIONS D'OF ======
CREATE TABLE creations_of (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  of_type TEXT NOT NULL CHECK (of_type IN ('action_formation', 'cfa', 'bilan', 'vae', 'elus', 'agents_ia')),
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en_cours', 'verification_expert', 'greffe', 'nda_dreets', 'termine', 'refuse')),
  current_step INT DEFAULT 1, -- 1 à 5
  base_price_cents INT NOT NULL,
  total_price_cents INT NOT NULL, -- base + options
  has_kbis BOOLEAN DEFAULT FALSE, -- réduction 100€ si true
  payment_mode TEXT DEFAULT '1x' CHECK (payment_mode IN ('1x', '2x', '3x')),
  stripe_payment_id TEXT,
  stripe_checkout_session TEXT,
  paid BOOLEAN DEFAULT FALSE,
  expert_id UUID REFERENCES profiles(id),
  expert_comment TEXT,
  -- Infos résultat
  kbis_number TEXT,
  nda_number TEXT,
  siret TEXT,
  of_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== OPTIONS CHOISIES POUR CRÉATION OF ======
CREATE TABLE creation_of_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_of_id UUID REFERENCES creations_of(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL CHECK (option_type IN ('qualiopi', 'agents_ia', 'edof', 'domiciliation', 'opco_pack', 'site_web')),
  price_cents INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== ANNONCES / MISSIONS ======
CREATE TABLE annonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  description TEXT,
  daily_rate TEXT, -- ex: "350€/jour"
  duration TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  stripe_payment_id TEXT, -- si premium (29€)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'en_attente', 'expiree', 'supprimee')),
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== CANDIDATURES ======
CREATE TABLE candidatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  annonce_id UUID REFERENCES annonces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'acceptee', 'refusee', 'retiree')),
  message TEXT, -- message de candidature
  recruiter_reply TEXT, -- réponse du recruteur
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(annonce_id, user_id) -- un seul postulat par annonce
);

-- ====== FORMATION FORMATEUR ======
CREATE TABLE formations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'inscrit' CHECK (status IN ('inscrit', 'en_cours', 'certifie', 'abandonne')),
  progress_percent INT DEFAULT 0,
  current_module INT DEFAULT 1, -- 1 à 5
  amount_cents INT DEFAULT 149000, -- 1490€
  stripe_payment_id TEXT,
  stripe_checkout_session TEXT,
  paid BOOLEAN DEFAULT FALSE,
  fifpl_status TEXT DEFAULT 'non_demande' CHECK (fifpl_status IN ('non_demande', 'depose', 'accepte', 'refuse', 'rembourse')),
  professional_status TEXT, -- indépendant, salarié, demandeur_emploi, autre
  certified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== MODULES DE FORMATION ======
CREATE TABLE formation_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id UUID REFERENCES formations(id) ON DELETE CASCADE,
  module_number INT NOT NULL, -- 1 à 5
  title TEXT NOT NULL,
  duration_hours DECIMAL(4,1),
  status TEXT DEFAULT 'verrouille' CHECK (status IN ('verrouille', 'en_cours', 'termine')),
  score INT, -- pourcentage
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ====== PAIEMENTS (log de tous les paiements Stripe) ======
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_type TEXT NOT NULL, -- demarche, creation_of, annonce_premium, formation
  reference_id UUID, -- ID de la démarche, création OF, annonce ou formation
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====== INDEX POUR PERFORMANCE ======
CREATE INDEX idx_demarches_user ON demarches(user_id);
CREATE INDEX idx_demarches_status ON demarches(status);
CREATE INDEX idx_demarches_expert ON demarches(expert_id);
CREATE INDEX idx_creations_user ON creations_of(user_id);
CREATE INDEX idx_creations_status ON creations_of(status);
CREATE INDEX idx_documents_demarche ON documents(demarche_id);
CREATE INDEX idx_documents_creation ON documents(creation_of_id);
CREATE INDEX idx_annonces_status ON annonces(status);
CREATE INDEX idx_annonces_author ON annonces(author_id);
CREATE INDEX idx_candidatures_annonce ON candidatures(annonce_id);
CREATE INDEX idx_candidatures_user ON candidatures(user_id);
CREATE INDEX idx_formations_user ON formations(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe ON payments(stripe_session_id);

-- ====== ROW LEVEL SECURITY (RLS) ======
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demarches ENABLE ROW LEVEL SECURITY;
ALTER TABLE demarche_opco ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE creations_of ENABLE ROW LEVEL SECURITY;
ALTER TABLE creation_of_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formation_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policies : les users voient leurs propres données
CREATE POLICY "Users see own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users see own demarches" ON demarches FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own creations" ON creations_of FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own candidatures" ON candidatures FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own formations" ON formations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users see own payments" ON payments FOR ALL USING (auth.uid() = user_id);

-- Annonces visibles par tous (en lecture), modifiables par l'auteur
CREATE POLICY "Annonces public read" ON annonces FOR SELECT USING (status = 'active');
CREATE POLICY "Annonces author write" ON annonces FOR ALL USING (auth.uid() = author_id);

-- Experts voient les dossiers qui leur sont assignés
CREATE POLICY "Expert see assigned demarches" ON demarches FOR SELECT USING (auth.uid() = expert_id);
CREATE POLICY "Expert see assigned creations" ON creations_of FOR SELECT USING (auth.uid() = expert_id);

-- Documents : visibles par le propriétaire du dossier et l'expert
CREATE POLICY "Docs owner access" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM demarches WHERE demarches.id = documents.demarche_id AND demarches.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM creations_of WHERE creations_of.id = documents.creation_of_id AND creations_of.user_id = auth.uid())
);

-- ====== STORAGE BUCKETS ======
-- À créer dans Supabase Dashboard :
-- Bucket "documents" (privé) → pour les fichiers uploadés par les clients
-- Bucket "avatars" (public) → pour les photos de profil
