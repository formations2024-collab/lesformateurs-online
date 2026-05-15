-- RPC pour l'insertion publique du formulaire EDOF (page /formulaire-edof)
-- SECURITY DEFINER permet de bypasser RLS pour les visiteurs non authentifiés
CREATE OR REPLACE FUNCTION submit_edof_form(
  p_email TEXT,
  p_siren TEXT,
  p_org_name TEXT,
  p_form_data JSONB,
  p_metadata JSONB
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO demarches (category, type, status, current_step, total_steps, client_email, siren, org_name, form_data, metadata)
  VALUES ('demarche', 'edof', 'configuration', 1, 5, p_email, p_siren, p_org_name, p_form_data, p_metadata)
  RETURNING id INTO new_id;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION submit_edof_form TO anon, authenticated;
