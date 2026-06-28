-- ============================================================================
-- Sub-gebied functies voor Gebied B
-- ============================================================================

-- Resultaten uitbreiden met sub_gebied
ALTER TABLE resultaten ADD COLUMN IF NOT EXISTS sub_gebied TEXT;

-- volgende_vraag_sub: adaptief per sub-gebied
CREATE OR REPLACE FUNCTION volgende_vraag_sub(
    p_sessie_id UUID,
    p_gebied TEXT,
    p_sub_gebied TEXT
) RETURNS UUID AS $$
DECLARE
    v_vorige_stap RECORD;
    v_niveau_doel INT;
    v_volgende_vraag_id UUID;
    v_laatste_vraag_id UUID;
BEGIN
    SELECT a.is_correct, v.niveau, a.vraag_id
    INTO v_vorige_stap
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.sub_gebied = p_sub_gebied
    ORDER BY a.beantwoord_op DESC LIMIT 1;

    IF v_vorige_stap IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen WHERE gebied = p_gebied AND sub_gebied = p_sub_gebied AND niveau = 1
        ORDER BY RANDOM() LIMIT 1;
        RETURN v_volgende_vraag_id;
    END IF;

    v_laatste_vraag_id := v_vorige_stap.vraag_id;

    IF v_vorige_stap.is_correct THEN
        v_niveau_doel := v_vorige_stap.niveau + 1;
        IF v_niveau_doel > 5 THEN RETURN NULL; END IF;
    ELSE
        -- Check of dit de 2e fout op dit niveau is
        IF EXISTS (
            SELECT 1 FROM antwoorden a
            JOIN vragen v2 ON v2.id = a.vraag_id
            WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
              AND v2.sub_gebied = p_sub_gebied AND v2.niveau = v_vorige_stap.niveau
              AND a.id != (SELECT a2.id FROM antwoorden a2 JOIN vragen v3 ON v3.id = a2.vraag_id
                           WHERE a2.sessie_id = p_sessie_id AND a2.gebied = p_gebied AND v3.sub_gebied = p_sub_gebied
                           ORDER BY a2.beantwoord_op DESC LIMIT 1)
        ) THEN
            RETURN NULL; -- 2e fout: sub stopt
        ELSE
            v_niveau_doel := v_vorige_stap.niveau; -- herkansing zelfde niveau
        END IF;
    END IF;

    SELECT id INTO v_volgende_vraag_id
    FROM vragen
    WHERE gebied = p_gebied AND sub_gebied = p_sub_gebied AND niveau = v_niveau_doel
      AND (v_laatste_vraag_id IS NULL OR id != v_laatste_vraag_id)
    ORDER BY RANDOM() LIMIT 1;

    IF v_volgende_vraag_id IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen WHERE gebied = p_gebied AND sub_gebied = p_sub_gebied AND niveau = v_niveau_doel
        ORDER BY RANDOM() LIMIT 1;
    END IF;

    RETURN v_volgende_vraag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- bereken_niveau_sub: bepaal niveau per sub-gebied
CREATE OR REPLACE FUNCTION bereken_niveau_sub(
    p_sessie_id UUID,
    p_gebied TEXT,
    p_sub_gebied TEXT
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
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.sub_gebied = p_sub_gebied
      AND a.is_correct = TRUE;

    SELECT v.niveau, a.is_correct INTO v_laatste_niveau, v_laatste_correct
    FROM antwoorden a JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.sub_gebied = p_sub_gebied
    ORDER BY a.beantwoord_op DESC LIMIT 1;

    SELECT COUNT(*) INTO v_aantal_op_niveau
    FROM antwoorden a JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.sub_gebied = p_sub_gebied
      AND v.niveau = v_laatste_niveau;

    IF v_hoogste_correct IS NULL THEN RETURN 0; END IF;
    IF v_laatste_correct THEN RETURN v_laatste_niveau; END IF;
    IF v_aantal_op_niveau >= 2 THEN RETURN GREATEST(v_laatste_niveau - 1, 0); END IF;
    RETURN COALESCE(v_hoogste_correct, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
