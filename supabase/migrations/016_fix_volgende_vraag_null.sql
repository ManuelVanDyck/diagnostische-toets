-- Quick fix volgende_vraag: NULL-safe vergelijking
CREATE OR REPLACE FUNCTION volgende_vraag(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS UUID AS $$
DECLARE
    v_vorige_stap RECORD;
    v_niveau_doel INT;
    v_volgende_vraag_id UUID;
    v_laatste_vraag_id UUID;
BEGIN
    -- Laatste antwoord ophalen
    SELECT a.is_correct, v.niveau, a.vraag_id
    INTO v_vorige_stap
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
    ORDER BY a.beantwoord_op DESC
    LIMIT 1;

    -- Geen vragen beantwoord → start niveau 1
    IF v_vorige_stap IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen WHERE gebied = p_gebied AND niveau = 1
        ORDER BY RANDOM() LIMIT 1;
        RETURN v_volgende_vraag_id;
    END IF;

    v_laatste_vraag_id := v_vorige_stap.vraag_id;

    IF v_vorige_stap.is_correct THEN
        v_niveau_doel := v_vorige_stap.niveau + 1;
        IF v_niveau_doel > 5 THEN RETURN NULL; END IF;
    ELSE
        -- Check of dit een herkansing was (al 2 antwoorden op dit niveau?)
        IF EXISTS (
            SELECT 1 FROM antwoorden a
            JOIN vragen v2 ON v2.id = a.vraag_id
            WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
              AND v2.niveau = v_vorige_stap.niveau
              AND a.id != (SELECT a2.id FROM antwoorden a2 WHERE a2.sessie_id = p_sessie_id AND a2.gebied = p_gebied ORDER BY a2.beantwoord_op DESC LIMIT 1)
        ) THEN
            RETURN NULL; -- 2e fout → stop
        ELSE
            v_niveau_doel := v_vorige_stap.niveau; -- herkansing
        END IF;
    END IF;

    -- Zoek vraag NIET gelijk aan de laatste (NULL-safe)
    SELECT id INTO v_volgende_vraag_id
    FROM vragen
    WHERE gebied = p_gebied AND niveau = v_niveau_doel
      AND (v_laatste_vraag_id IS NULL OR id != v_laatste_vraag_id)
    ORDER BY RANDOM() LIMIT 1;

    -- Fallback
    IF v_volgende_vraag_id IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen WHERE gebied = p_gebied AND niveau = v_niveau_doel
        ORDER BY RANDOM() LIMIT 1;
    END IF;

    RETURN v_volgende_vraag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
