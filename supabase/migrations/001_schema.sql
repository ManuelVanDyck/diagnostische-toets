-- ============================================================================
-- Migratie 001: Diagnostische Adaptieve Toets — Volledig Schema
-- ============================================================================

-- Extensies
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Tabel: leerlingen
-- ============================================================================
CREATE TABLE leerlingen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,                    -- voornaam.naam@classroomatheneum.be
    voornaam TEXT NOT NULL,
    naam TEXT NOT NULL,
    klas TEXT,                                     -- bv. "4A", "4B"
    rol TEXT NOT NULL DEFAULT 'leerling' CHECK (rol IN ('leerling', 'leerkracht')),
    aangemaakt_op TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index voor snelle lookup op email (login)
CREATE INDEX idx_leerlingen_email ON leerlingen(email);
CREATE INDEX idx_leerlingen_klas ON leerlingen(klas);

-- ============================================================================
-- Tabel: toets_sessies
-- ============================================================================
CREATE TABLE toets_sessies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leerling_id UUID NOT NULL REFERENCES leerlingen(id) ON DELETE CASCADE,
    deel INT NOT NULL CHECK (deel IN (1, 2)),      -- Deel 1 (A-D) of Deel 2 (E-G)
    gestart_op TIMESTAMPTZ NOT NULL DEFAULT now(),
    beeindigd_op TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'bezig' CHECK (status IN ('bezig', 'afgerond', 'verlopen'))
);

CREATE INDEX idx_sessies_leerling ON toets_sessies(leerling_id);
CREATE INDEX idx_sessies_status ON toets_sessies(status);

-- ============================================================================
-- Tabel: vragen
-- ============================================================================
CREATE TABLE vragen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gebied TEXT NOT NULL CHECK (gebied IN ('A','B','C','D','E','F','G')),
    leerplandoel TEXT NOT NULL,                     -- bv. "BV1_06.01"
    niveau INT NOT NULL CHECK (niveau IN (1, 2, 3)), -- 1=Begrijpen, 2=Toepassen, 3=Analyseren
    deel INT NOT NULL CHECK (deel IN (1, 2)),       -- In welk toetsdeel hoort deze vraag?
    type TEXT NOT NULL CHECK (type IN ('meerkeuze', 'invul', 'meerkeuze_meervoudig')),
    vraag_html TEXT NOT NULL,                       -- Vraagtekst met KaTeX
    keuzes_json JSONB,                              -- null voor invul; [{label, waarde}] voor MC
    juist_antwoord TEXT NOT NULL,                   -- Exact juiste antwoord
    tolerantie FLOAT DEFAULT NULL,                  -- null voor MC; 0.001 voor invul
    uitleg_html TEXT,                               -- Feedback bij fout antwoord
    bron_module TEXT,                               -- bv. "N1_M04"
    moeilijkheid_pilot FLOAT
);

CREATE INDEX idx_vragen_gebied ON vragen(gebied);
CREATE INDEX idx_vragen_gebied_niveau ON vragen(gebied, niveau);
CREATE INDEX idx_vragen_deel ON vragen(deel);

-- ============================================================================
-- Tabel: antwoorden
-- ============================================================================
CREATE TABLE antwoorden (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessie_id UUID NOT NULL REFERENCES toets_sessies(id) ON DELETE CASCADE,
    vraag_id UUID NOT NULL REFERENCES vragen(id) ON DELETE RESTRICT,
    gebied TEXT NOT NULL CHECK (gebied IN ('A','B','C','D','E','F','G')),
    gegeven_antwoord TEXT NOT NULL,
    is_correct BOOL NOT NULL,
    tijd_seconden INT,
    stap INT NOT NULL CHECK (stap IN (1, 2, 3)),    -- Welke adaptieve stap (1-3)
    beantwoord_op TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_antwoorden_sessie ON antwoorden(sessie_id);
CREATE INDEX idx_antwoorden_sessie_gebied ON antwoorden(sessie_id, gebied);

-- ============================================================================
-- Tabel: resultaten
-- ============================================================================
CREATE TABLE resultaten (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessie_id UUID NOT NULL REFERENCES toets_sessies(id) ON DELETE CASCADE,
    leerling_id UUID NOT NULL REFERENCES leerlingen(id) ON DELETE CASCADE,
    gebied TEXT NOT NULL CHECK (gebied IN ('A','B','C','D','E','F','G')),
    beheersingsniveau INT NOT NULL CHECK (beheersingsniveau IN (0, 1, 2, 3)),
    aantal_vragen INT NOT NULL,
    aantal_correct INT NOT NULL,
    tijd_totaal INT                                 -- Seconden
);

CREATE INDEX idx_resultaten_sessie ON resultaten(sessie_id);
CREATE INDEX idx_resultaten_leerling ON resultaten(leerling_id);

-- ============================================================================
-- Functie: volgende_vraag(sessie_id, gebied)
-- Bepaalt de volgende vraag in het adaptieve pad voor een gegeven sessie+gebied.
-- Returns UUID van de volgende vraag, of NULL als het gebied afgerond is.
-- ============================================================================
CREATE OR REPLACE FUNCTION volgende_vraag(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS UUID AS $$
DECLARE
    v_aantal_beantwoord INT;
    v_deel INT;
    v_laatst_correct BOOL;
    v_niveau_filter INT;
    v_huidige_vraag_id UUID;
    v_volgende_vraag_id UUID;
BEGIN
    -- Bepaal het toetsdeel van deze sessie
    SELECT deel INTO v_deel FROM toets_sessies WHERE id = p_sessie_id;

    -- Tel beantwoorde vragen voor dit gebied in deze sessie
    SELECT COUNT(*) INTO v_aantal_beantwoord
    FROM antwoorden
    WHERE sessie_id = p_sessie_id AND gebied = p_gebied;

    -- Stap 0: Start met screeningvraag (niveau 2)
    IF v_aantal_beantwoord = 0 THEN
        SELECT id INTO v_volgende_vraag_id
        FROM vragen
        WHERE gebied = p_gebied AND niveau = 2 AND deel = v_deel
        ORDER BY RANDOM()
        LIMIT 1;
        RETURN v_volgende_vraag_id;
    END IF;

    -- Stap 1: Na eerste antwoord
    IF v_aantal_beantwoord = 1 THEN
        -- Was de eerste vraag correct?
        SELECT is_correct INTO v_laatst_correct
        FROM antwoorden
        WHERE sessie_id = p_sessie_id AND gebied = p_gebied AND stap = 1;

        IF v_laatst_correct THEN
            -- Juist → moeilijkere vraag (niveau 3)
            v_niveau_filter := 3;
        ELSE
            -- Fout → makkelijkere vraag (niveau 1)
            v_niveau_filter := 1;
        END IF;

        -- Zoek een vraag van het juiste niveau, bij voorkeur een ander leerplandoel
        SELECT id INTO v_huidige_vraag_id
        FROM antwoorden
        WHERE sessie_id = p_sessie_id AND gebied = p_gebied AND stap = 1;

        SELECT v.id INTO v_volgende_vraag_id
        FROM vragen v
        WHERE v.gebied = p_gebied
          AND v.niveau = v_niveau_filter
          AND v.deel = v_deel
          AND v.leerplandoel != (SELECT leerplandoel FROM vragen WHERE id = v_huidige_vraag_id)
        ORDER BY RANDOM()
        LIMIT 1;

        -- Fallback: als er geen vraag met ander leerdoel is, neem dan eender welke
        IF v_volgende_vraag_id IS NULL THEN
            SELECT id INTO v_volgende_vraag_id
            FROM vragen
            WHERE gebied = p_gebied AND niveau = v_niveau_filter AND deel = v_deel
            ORDER BY RANDOM()
            LIMIT 1;
        END IF;

        RETURN v_volgende_vraag_id;
    END IF;

    -- Stap 2+: Gebied is afgerond
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Helper: bereken beheersingsniveau op basis van antwoorden in een gebied
-- ============================================================================
CREATE OR REPLACE FUNCTION bereken_beheersingsniveau(
    p_sessie_id UUID,
    p_gebied TEXT
) RETURNS INT AS $$
DECLARE
    v_stap1_correct BOOL;
    v_stap2_correct BOOL;
    v_stap2_niveau INT;
    v_niveau INT;
BEGIN
    -- Stap 1 (niveau 2 screening)
    SELECT is_correct INTO v_stap1_correct
    FROM antwoorden WHERE sessie_id = p_sessie_id AND gebied = p_gebied AND stap = 1;

    -- Stap 2
    SELECT is_correct, (SELECT niveau FROM vragen WHERE id = a.vraag_id)
    INTO v_stap2_correct, v_stap2_niveau
    FROM antwoorden a
    WHERE a.sessie_id = p_sessie_id AND a.gebied = p_gebied AND a.stap = 2;

    -- Adaptieve routing
    IF v_stap1_correct IS NULL THEN
        RETURN 0; -- Geen vragen beantwoord
    ELSIF NOT v_stap1_correct THEN
        -- Screening fout → niveau 1 aangeboden
        IF v_stap2_correct IS NULL THEN
            RETURN 0; -- Geen vervolgvraag beantwoord (zou niet mogen)
        ELSIF v_stap2_correct THEN
            RETURN 1; -- Niveau 1 correct → niveau 1
        ELSE
            RETURN 0; -- Niveau 1 ook fout → niveau 0
        END IF;
    ELSE
        -- Screening correct → niveau 3 aangeboden
        IF v_stap2_correct IS NULL THEN
            RETURN 2; -- Geen vervolgvraag beantwoord
        ELSIF v_stap2_correct THEN
            RETURN 3; -- Niveau 3 correct → niveau 3
        ELSE
            RETURN 2; -- Niveau 3 fout → niveau 2
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Leerlingen: ziet alleen eigen record
ALTER TABLE leerlingen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leerling ziet eigen record" ON leerlingen
    FOR SELECT USING (auth.uid()::text = id::text);

-- Leerkracht ziet alle leerlingen (wordt later via app-logica gefilterd op klas)
CREATE POLICY "Leerkracht ziet alle leerlingen" ON leerlingen
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM leerlingen l WHERE l.id::text = auth.uid()::text AND l.rol = 'leerkracht')
    );

-- toets_sessies: leerling ziet eigen sessies
ALTER TABLE toets_sessies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leerling beheert eigen sessies" ON toets_sessies
    FOR ALL USING (leerling_id::text = auth.uid()::text);

CREATE POLICY "Leerkracht ziet alle sessies" ON toets_sessies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM leerlingen WHERE id::text = auth.uid()::text AND rol = 'leerkracht')
    );

-- antwoorden: via sessie_id
ALTER TABLE antwoorden ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leerling beheert eigen antwoorden" ON antwoorden
    FOR ALL USING (
        EXISTS (SELECT 1 FROM toets_sessies s WHERE s.id = antwoorden.sessie_id AND s.leerling_id::text = auth.uid()::text)
    );

CREATE POLICY "Leerkracht ziet alle antwoorden" ON antwoorden
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM leerlingen WHERE id::text = auth.uid()::text AND rol = 'leerkracht')
    );

-- resultaten: idem
ALTER TABLE resultaten ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leerling ziet eigen resultaten" ON resultaten
    FOR SELECT USING (leerling_id::text = auth.uid()::text);

CREATE POLICY "Leerkracht ziet alle resultaten" ON resultaten
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM leerlingen WHERE id::text = auth.uid()::text AND rol = 'leerkracht')
    );

-- vragen: iedereen mag lezen (authenticated users only)
ALTER TABLE vragen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users lezen vragen" ON vragen
    FOR SELECT USING (auth.role() = 'authenticated');
