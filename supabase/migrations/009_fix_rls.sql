-- ============================================================================
-- Migratie 009: RLS-policies fixen — recursie- en INSERT-problemen oplossen
-- ============================================================================

-- 1. Leerlingen: verwijder recursieve leerkracht-policy
DROP POLICY IF EXISTS "Leerkracht ziet alle leerlingen" ON leerlingen;

-- Leerkracht-check via JWT (raw_app_meta_data bevat de rol niet standaard)
-- Gebruik een helper-functie zonder RLS-recursie
CREATE OR REPLACE FUNCTION public.is_leerkracht()
RETURNS BOOLEAN
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
    v_rol TEXT;
BEGIN
    SELECT rol INTO v_rol FROM leerlingen WHERE id = auth.uid();
    RETURN v_rol = 'leerkracht';
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "Leerkracht ziet alle leerlingen" ON leerlingen
    FOR SELECT USING (public.is_leerkracht());

-- 2. toets_sessies: INSERT toestaan voor ingelogde gebruiker
DROP POLICY IF EXISTS "Leerling beheert eigen sessies" ON toets_sessies;
CREATE POLICY "Leerling beheert eigen sessies" ON toets_sessies
    FOR ALL
    USING (leerling_id = auth.uid())
    WITH CHECK (leerling_id = auth.uid());

DROP POLICY IF EXISTS "Leerkracht ziet alle sessies" ON toets_sessies;
CREATE POLICY "Leerkracht ziet alle sessies" ON toets_sessies
    FOR SELECT USING (public.is_leerkracht());

-- 3. antwoorden: INSERT toestaan
DROP POLICY IF EXISTS "Leerling beheert eigen antwoorden" ON antwoorden;
CREATE POLICY "Leerling beheert eigen antwoorden" ON antwoorden
    FOR ALL
    USING (EXISTS (SELECT 1 FROM toets_sessies s WHERE s.id = antwoorden.sessie_id AND s.leerling_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM toets_sessies s WHERE s.id = antwoorden.sessie_id AND s.leerling_id = auth.uid()));

DROP POLICY IF EXISTS "Leerkracht ziet alle antwoorden" ON antwoorden;
CREATE POLICY "Leerkracht ziet alle antwoorden" ON antwoorden
    FOR SELECT USING (public.is_leerkracht());

-- 4. resultaten: leerkracht-policy fixen
DROP POLICY IF EXISTS "Leerkracht ziet alle resultaten" ON resultaten;
CREATE POLICY "Leerkracht ziet alle resultaten" ON resultaten
    FOR SELECT USING (public.is_leerkracht());

-- 5. resultaten: ook INSERT toestaan voor leerling
DROP POLICY IF EXISTS "Leerling ziet eigen resultaten" ON resultaten;
CREATE POLICY "Leerling beheert eigen resultaten" ON resultaten
    FOR ALL
    USING (leerling_id = auth.uid())
    WITH CHECK (leerling_id = auth.uid());
