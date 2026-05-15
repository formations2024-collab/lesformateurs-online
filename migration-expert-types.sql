ALTER TABLE profiles ADD COLUMN IF NOT EXISTS expert_types JSONB DEFAULT '[]'::jsonb;
