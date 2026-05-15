-- Bucket 'formulaires' à créer en PRIVÉ dans Supabase Dashboard → Storage → New bucket (Public: OFF)
-- Puis policies :

-- Upload public (depuis formulaire-edof anonyme)
CREATE POLICY "Public upload formulaire docs"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'formulaires');

-- Lecture réservée aux admins (signed URLs générées côté client par admin)
CREATE POLICY "Admin read formulaire docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'formulaires'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
