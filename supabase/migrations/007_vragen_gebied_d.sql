-- ============================================================================
-- Gebied D: Vergelijkingen & ongelijkheden — 9 vragen
-- Bron: N1_M13, N2_M08 Consolidatie (Nando)
-- ============================================================================

-- Niveau 1: Begrijpen (B)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.17', 1, 'meerkeuze',
    'Welke vergelijking heeft −5 als oplossing?',
    '[
        {"label": "5 − x = 10", "waarde": "A"},
        {"label": "5 · x = −20", "waarde": "B"},
        {"label": "−5 · x = −10", "waarde": "C"},
        {"label": "2 · x = −3", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Vul x = −5 in: A: 5−(−5) = 10 ✅. B: 5·(−5) = −25 ≠ −20. C: −5·(−5) = 25 ≠ −10. D: 2·(−5) = −10 ≠ −3.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.17', 1, 'meerkeuze',
    'Welke vergelijking heeft −5 als oplossing?',
    '[
        {"label": "x + 3 = −2", "waarde": "A"},
        {"label": "2x = 10", "waarde": "B"},
        {"label": "−x = −5", "waarde": "C"},
        {"label": "x − 5 = 0", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Vul x = −5 in: A: −5+3 = −2 ✅. B: 2·(−5) = −10 ≠ 10. C: −(−5) = 5 ≠ −5. D: −5−5 = −10 ≠ 0.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.17', 1, 'meerkeuze',
    '"Vier meer dan een getal" — vertaal naar wiskundetaal (gebruik p als onbekende).',
    '[
        {"label": "p + 4", "waarde": "A"},
        {"label": "4p", "waarde": "B"},
        {"label": "4 − p", "waarde": "C"},
        {"label": "p − 4", "waarde": "D"}
    ]'::jsonb,
    'A',
    '"Vier meer dan een getal" betekent: het getal plus 4, dus p + 4. "Vier keer een getal" zou 4p zijn.',
    'N1_M13'
);

-- Niveau 2: Toepassen (T)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.17', 2, 'invul',
    'Los op: −8x = 24<br><br>x = ?',
    '-3',
    0.001,
    '−8x = 24 → deel beide zijden door −8: x = 24 ÷ (−8) = −3. Controle: −8·(−3) = 24 ✅.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.17', 2, 'invul',
    'Los op: x + 12 = −2<br><br>x = ?',
    '-14',
    0.001,
    'x + 12 = −2 → trek 12 af van beide zijden: x = −2 − 12 = −14. Controle: −14 + 12 = −2 ✅.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 2, 'meerkeuze',
    'Los op: −2x + 5 = 7',
    '[
        {"label": "x = −1", "waarde": "A"},
        {"label": "x = 1", "waarde": "B"},
        {"label": "x = −6", "waarde": "C"},
        {"label": "x = 6", "waarde": "D"}
    ]'::jsonb,
    'A',
    '−2x + 5 = 7 → −2x = 2 → x = −1. Controle: −2·(−1) + 5 = 2 + 5 = 7 ✅.',
    'N1_M13'
);

-- Niveau 3: Analyseren (A)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'D', 'BV1_06.15', 3, 'invul',
    '6 meer dan het dubbel van een getal is gelijk aan 3 minder dan dat getal.<br><br>Bepaal het getal door een vergelijking op te lossen.<br><br>Het getal = ?',
    '-9',
    0.001,
    'Stel x = het getal. "Dubbel + 6" = 2x + 6. "3 minder" = x − 3.<br>Vergelijking: 2x + 6 = x − 3 → x = −9.<br>Controle: 2·(−9)+6 = −18+6 = −12. −9−3 = −12 ✅.',
    'N2_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 3, 'meerkeuze',
    'Los op: 5% van x is 15. Hoeveel is x?',
    '[
        {"label": "x = 300", "waarde": "A"},
        {"label": "x = 75", "waarde": "B"},
        {"label": "x = 3", "waarde": "C"},
        {"label": "x = 150", "waarde": "D"}
    ]'::jsonb,
    'A',
    '5% van x = 15 → 0,05x = 15 → x = 15 ÷ 0,05 = 300. Controle: 5% van 300 = 15 ✅.',
    'N2_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 3, 'meerkeuze_meervoudig',
    'Welke van deze vergelijkingen is eerstegraads?',
    '[
        {"label": "x² − 4 = 0", "waarde": "A"},
        {"label": "3x + 7 = 22", "waarde": "B"},
        {"label": "2x − 8 = 20", "waarde": "C"},
        {"label": "1/x = 5", "waarde": "D"},
        {"label": "5(x + 2) = 3x − 4", "waarde": "E"}
    ]'::jsonb,
    'B,C,E',
    'Eerstegraads: de onbekende x komt enkel voor tot de macht 1. A: x² is tweedegraads. B: 3x is eerstegraads ✅. C: 2x is eerstegraads ✅. D: 1/x = x⁻¹, niet eerstegraads. E: uitwerken geeft 5x+10=3x−4, eerstegraads ✅.',
    'N2_M08'
);
