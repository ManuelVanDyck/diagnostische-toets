-- ============================================================================
-- Migratie 014: Uitbreiding naar 5 niveaus
-- ============================================================================

-- 1. Vragen: niveau 1-5 i.p.v. 1-3
ALTER TABLE vragen DROP CONSTRAINT IF EXISTS vragen_niveau_check;
ALTER TABLE vragen ADD CONSTRAINT vragen_niveau_check CHECK (niveau IN (1, 2, 3, 4, 5));

-- 2. Resultaten: niveau 0-5
ALTER TABLE resultaten DROP CONSTRAINT IF EXISTS resultaten_beheersingsniveau_check;
ALTER TABLE resultaten ADD CONSTRAINT resultaten_beheersingsniveau_check CHECK (beheersingsniveau IN (0, 1, 2, 3, 4, 5));

-- ============================================================================
-- 3. volgende_vraag() — 5 niveaus, 2 herkansingen per niveau
-- ============================================================================
CREATE OR REPLACE FUNCTION volgende_vraag(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS UUID AS $$
DECLARE
    v_aantal_beantwoord INT;
    v_vorige_stap RECORD;
    v_niveau_doel INT;
    v_volgende_vraag_id UUID;
    v_laatste_vraag_id UUID;
BEGIN
    SELECT COUNT(*) INTO v_aantal_beantwoord
    FROM antwoorden
    WHERE sessie_id = p_sessie_id AND gebied = p_gebied;

    -- Start op niveau 1
    IF v_aantal_beantwoord = 0 THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen
        WHERE gebied = p_gebied AND niveau = 1
        ORDER BY RANDOM()
        LIMIT 1;
        RETURN v_volgende_vraag_id;
    END IF;

    -- Laatste antwoord ophalen
    SELECT a.is_correct, v.niveau, a.vraag_id
    INTO v_vorige_stap
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
    ORDER BY a.beantwoord_op DESC
    LIMIT 1;

    SELECT vraag_id INTO v_laatste_vraag_id
    FROM antwoorden
    WHERE sessie_id = p_sessie_id AND gebied = p_gebied
    ORDER BY beantwoord_op DESC
    LIMIT 1;

    IF v_vorige_stap.is_correct THEN
        v_niveau_doel := v_vorige_stap.niveau + 1;
        IF v_niveau_doel > 5 THEN RETURN NULL; END IF;
    ELSE
        -- Check of dit een herkansing was
        IF EXISTS (
            SELECT 1 FROM antwoorden a
            JOIN vragen v ON v.id = a.vraag_id
            WHERE a.sessie_id = p_sessie_id
              AND a.gebied = p_gebied
              AND v.niveau = v_vorige_stap.niveau
              AND a.id != (
                SELECT id FROM antwoorden WHERE sessie_id = p_sessie_id AND gebied = p_gebied ORDER BY beantwoord_op DESC LIMIT 1
              )
        ) THEN
            -- 2e fout = niveau omlaag, stop
            RETURN NULL;
        ELSE
            -- Eerste fout = herkansing zelfde niveau
            v_niveau_doel := v_vorige_stap.niveau;
        END IF;
    END IF;

    SELECT id INTO v_volgende_vraag_id
    FROM vragen
    WHERE gebied = p_gebied AND niveau = v_niveau_doel AND id != v_laatste_vraag_id
    ORDER BY RANDOM() LIMIT 1;

    IF v_volgende_vraag_id IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen WHERE gebied = p_gebied AND niveau = v_niveau_doel
        ORDER BY RANDOM() LIMIT 1;
    END IF;

    RETURN v_volgende_vraag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. bereken_beheersingsniveau() — 5 niveaus
-- ============================================================================
CREATE OR REPLACE FUNCTION bereken_beheersingsniveau(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS INT AS $$
DECLARE
    v_hoogste_correct INT;
    v_laatste_niveau INT;
    v_laatste_correct BOOL;
    v_aantal_op_niveau INT;
BEGIN
    SELECT MAX(v.niveau) INTO v_hoogste_correct
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND a.is_correct = TRUE;

    SELECT v.niveau, a.is_correct INTO v_laatste_niveau, v_laatste_correct
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
    ORDER BY a.beantwoord_op DESC LIMIT 1;

    SELECT COUNT(*) INTO v_aantal_op_niveau
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.niveau = v_laatste_niveau;

    IF v_hoogste_correct IS NULL THEN RETURN 0; END IF;

    -- Correct op laatste vraag → dat niveau
    IF v_laatste_correct THEN
        RETURN v_laatste_niveau;
    END IF;

    -- 2× fout op niveau X → niveau X-1
    IF v_aantal_op_niveau >= 2 THEN
        RETURN GREATEST(v_laatste_niveau - 1, 0);
    END IF;

    RETURN COALESCE(v_hoogste_correct, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
