-- Migration sécurité : policies RLS sur profiles
-- Empêche un utilisateur de s'auto-promouvoir admin/pro/premium ou de se débloquer.
-- À exécuter dans Supabase SQL editor.

-- Supprimer l'ancienne policy trop permissive
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own safe fields" ON profiles;
DROP POLICY IF EXISTS "Admin update any profile" ON profiles;
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;

-- SELECT : chacun voit son profil + admin voit tout
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- UPDATE user : ne peut pas modifier les champs sensibles
CREATE POLICY "Users update own safe fields" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (is_admin IS NOT DISTINCT FROM (SELECT p.is_admin FROM profiles p WHERE p.id = auth.uid()))
    AND (is_pro IS NOT DISTINCT FROM (SELECT p.is_pro FROM profiles p WHERE p.id = auth.uid()))
    AND (is_premium IS NOT DISTINCT FROM (SELECT p.is_premium FROM profiles p WHERE p.id = auth.uid()))
    AND (is_blocked IS NOT DISTINCT FROM (SELECT p.is_blocked FROM profiles p WHERE p.id = auth.uid()))
    AND (expert_types IS NOT DISTINCT FROM (SELECT p.expert_types FROM profiles p WHERE p.id = auth.uid()))
  );

-- UPDATE admin : peut tout modifier
CREATE POLICY "Admin update any profile" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
