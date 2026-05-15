-- Migration: Dual revenue system (parrainage 5% + cooptation 50€ per expert)
-- À appliquer dans Supabase SQL editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cooptation_balance_cents BIGINT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cooptation_total_cents BIGINT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_total_cents BIGINT DEFAULT 0;

ALTER TABLE referral_earnings ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'referral' CHECK (type IN ('referral','cooptation'));
CREATE INDEX IF NOT EXISTS idx_rearn_type ON referral_earnings(type);

-- Garde-fou anti-doublon cooptation sur expert_applications
ALTER TABLE expert_applications ADD COLUMN IF NOT EXISTS cooptation_paid BOOLEAN DEFAULT FALSE;
