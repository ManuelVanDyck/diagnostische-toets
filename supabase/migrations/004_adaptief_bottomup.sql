-- ============================================================================
-- Migratie 004: Bottom-up adaptief model + 7 aparte toetsen per gebied
-- ============================================================================
-- Wijzigingen:
-- 1. toets_sessies: deel → gebied
-- 2. nieuwe volgende_vraag() — bottom-up, 2 pogingen per niveau
-- 3. nieuwe bereken_beheersingsniveau()
-- 4. vragen tabel: deel-kolom blijft als metadata, wordt niet gebruikt in routing
-- ============================================================================

-- Stap 1: Pas toets_sessies aan
ALTER TABLE toets_sessies DROP COLUMN IF EXISTS deel;
ALTER TABLE toets_sessies ADD COLUMN IF NOT EXISTS gebied TEXT CHECK (gebied IN ('A','B','C','D','E','F','G'));

-- ============================================================================
-- Stap 2: Nieuwe volgende_vraag() — bottom-up adaptief
-- Logica:
--   Start op niveau 1
--   Per niveau max 2 vragen (1e poging + 1 herkansing bij fout)
--   Correct → niveau omhoog (1→2, 2→3)
--   Fout → herkansing op zelfde niveau
--   Fout op herkansing → niveau omlaag (1→0, 2→1, 3→2)
--   Correct op herkansing → blijf op huidig niveau (stop)
--   Correct op niveau 3 → niveau 3 (stop)
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
    -- Tel beantwoorde vragen voor dit gebied
    SELECT COUNT(*) INTO v_aantal_beantwoord
    FROM antwoorden
    WHERE sessie_id = p_sessie_id AND gebied = p_gebied;

    -- Geen vragen beantwoord → start op niveau 1
    IF v_aantal_beantwoord = 0 THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen
        WHERE gebied = p_gebied AND niveau = 1
        ORDER BY RANDOM()
        LIMIT 1;
        RETURN v_volgende_vraag_id;
    END IF;

    -- Haal de laatste beantwoording op
    SELECT a.is_correct, v.niveau, a.stap, a.vraag_id
    INTO v_vorige_stap
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
    ORDER BY a.beantwoord_op DESC
    LIMIT 1;

    -- Bepaal de laatste vraag_id
    SELECT vraag_id INTO v_laatste_vraag_id
    FROM antwoorden
    WHERE sessie_id = p_sessie_id AND gebied = p_gebied
    ORDER BY beantwoord_op DESC
    LIMIT 1;

    -- Bepaal doel-niveau
    IF v_vorige_stap.is_correct THEN
        -- Correct → ga een niveau omhoog
        v_niveau_doel := v_vorige_stap.niveau + 1;
        IF v_niveau_doel > 3 THEN
            RETURN NULL; -- Niveau 3 behaald, stop
        END IF;
    ELSE
        -- Fout → is dit een herkansing of eerste poging?
        -- Check of er al een eerdere vraag op dit niveau was
        IF EXISTS (
            SELECT 1 FROM antwoorden a
            JOIN vragen v ON v.id = a.vraag_id
            WHERE a.sessie_id = p_sessie_id
              AND a.gebied = p_gebied
              AND v.niveau = v_vorige_stap.niveau
              AND a.id != (SELECT id FROM antwoorden WHERE sessie_id = p_sessie_id AND gebied = p_gebied ORDER BY beantwoord_op DESC LIMIT 1)
        ) THEN
            -- Dit was een herkansing → niveau omlaag
            v_niveau_doel := v_vorige_stap.niveau - 1;
            IF v_niveau_doel < 0 THEN
                RETURN NULL; -- Niveau 0, stop
            END IF;
            -- Niveau omlaag: we stoppen, resultaat is het lagere niveau
            RETURN NULL;
        ELSE
            -- Eerste poging fout → herkansing op zelfde niveau
            v_niveau_doel := v_vorige_stap.niveau;
        END IF;
    END IF;

    -- Zoek een vraag van het doel-niveau, bij voorkeur een andere dan de vorige
    SELECT id INTO v_volgende_vraag_id
    FROM vragen
    WHERE gebied = p_gebied
      AND niveau = v_niveau_doel
      AND id != v_laatste_vraag_id
    ORDER BY RANDOM()
    LIMIT 1;

    -- Fallback: zelfde niveau, maakt niet uit welke vraag
    IF v_volgende_vraag_id IS NULL THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen
        WHERE gebied = p_gebied AND niveau = v_niveau_doel
        ORDER BY RANDOM()
        LIMIT 1;
    END IF;

    RETURN v_volgende_vraag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Stap 3: Nieuwe bereken_beheersingsniveau() — bottom-up logica
-- ============================================================================
CREATE OR REPLACE FUNCTION bereken_beheersingsniveau(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS INT AS $$
DECLARE
    v_hoger_niveau INT;
    v_laatste_niveau INT;
    v_laatste_correct BOOL;
    v_aantal_op_niveau INT;
BEGIN
    -- Kijk naar het hoogste niveau waarop correct is geantwoord
    SELECT MAX(v.niveau) INTO v_hoger_niveau
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND a.is_correct = TRUE;

    -- Kijk naar laatste antwoord
    SELECT v.niveau, a.is_correct INTO v_laatste_niveau, v_laatste_correct
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied
    ORDER BY a.beantwoord_op DESC
    LIMIT 1;

    -- Tel pogingen op het laatste niveau
    SELECT COUNT(*) INTO v_aantal_op_niveau
    FROM antwoorden a
    JOIN vragen v ON v.id = a.vraag_id
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND v.niveau = v_laatste_niveau;

    -- Bepaal niveau
    IF v_hoger_niveau IS NULL THEN
        -- Alles fout → niveau 0
        RETURN 0;
    END IF;

    -- Als laatste niveau 3 correct → niveau 3
    IF v_laatste_niveau = 3 AND v_laatste_correct THEN
        RETURN 3;
    END IF;

    -- Als laatste niveau 2 correct → niveau 2
    IF v_laatste_niveau = 2 AND v_laatste_correct THEN
        RETURN 2;
    END IF;

    -- Als laatste niveau 1 correct → niveau 1
    IF v_laatste_niveau = 1 AND v_laatste_correct THEN
        RETURN 1;
    END IF;

    -- Twee keer fout op niveau X → niveau X-1
    IF v_aantal_op_niveau >= 2 AND NOT v_laatste_correct THEN
        RETURN GREATEST(v_laatste_niveau - 1, 0);
    END IF;

    -- Fallback
    RETURN COALESCE(v_hoger_niveau, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
