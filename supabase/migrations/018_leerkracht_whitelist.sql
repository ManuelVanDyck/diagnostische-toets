-- ============================================================================
-- Migratie 018: Leerkracht-whitelist — enkel toegelaten e-mails
-- ============================================================================

-- Tabel voor leerkracht-toegang
CREATE TABLE IF NOT EXISTS leerkracht_toegang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    toegevoegd_op TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: alleen leerkrachten mogen de lijst zien
ALTER TABLE leerkracht_toegang ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leerkrachten zien whitelist" ON leerkracht_toegang
    FOR SELECT USING (public.is_leerkracht());

-- Vul de whitelist
INSERT INTO leerkracht_toegang (email) VALUES ('mdm@classroomatheneum.be')
ON CONFLICT (email) DO NOTHING;

-- Functie: check of een e-mail leerkracht mag zijn
CREATE OR REPLACE FUNCTION public.is_leerkracht_allowed(p_email TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
LANGUAGE plpgsql AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM leerkracht_toegang WHERE email = p_email);
END;
$$;

-- Update exec_sql om de nieuwe functie te kunnen gebruiken
-- (deze bestond al, maar voor de zekerheid)
