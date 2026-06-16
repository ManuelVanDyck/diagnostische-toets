-- ============================================================================
-- Gebied C: Algebraïsche uitdrukkingen & formules — 9 vragen
-- Bron: N1_M08, N2_M05 Consolidatie (Nando)
-- ============================================================================

-- Niveau 1: Begrijpen (B) — begrippen herkennen

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.11', 1, 'meerkeuze',
    'Is 5m + 3 een eenterm of een veelterm?',
    '[
        {"label": "Eenterm", "waarde": "A"},
        {"label": "Veelterm (tweeterm)", "waarde": "B"},
        {"label": "Geen van beide", "waarde": "C"},
        {"label": "Constante", "waarde": "D"}
    ]'::jsonb,
    'B',
    '5m + 3 bestaat uit twee termen (5m en 3), dus het is een veelterm. Een eenterm heeft maar één term, zoals 3p of 17a²b³.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.11', 1, 'meerkeuze',
    'Welke termen zijn gelijksoortig?',
    '[
        {"label": "5b en 9a", "waarde": "A"},
        {"label": "5b en 6b", "waarde": "B"},
        {"label": "5b en 18b²", "waarde": "C"},
        {"label": "−3b² en 6b", "waarde": "D"}
    ]'::jsonb,
    'B',
    'Gelijksoortige termen hebben hetzelfde lettergedeelte. 5b en 6b hebben allebei ''b'' als lettergedeelte. 18b² heeft ''b²'' — dat is verschillend van ''b''.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.11', 1, 'meerkeuze',
    'Wat betekent de notatie "2x" in de algebra?',
    '[
        {"label": "Het getal 2 gevolgd door de letter x", "waarde": "A"},
        {"label": "2 vermenigvuldigd met de variabele x", "waarde": "B"},
        {"label": "2 opgeteld bij x", "waarde": "C"},
        {"label": "Het getal 20 in Romeinse cijfers", "waarde": "D"}
    ]'::jsonb,
    'B',
    'In de algebra schrijven we het vermenigvuldigingsteken niet: 2x betekent 2 · x. Het getal 2 is de coëfficiënt, x is de variabele.',
    'N1_M08'
);

-- Niveau 2: Toepassen (T) — berekeningen uitvoeren

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 2, 'meerkeuze',
    'Herleid: 5x + 8x',
    '[
        {"label": "13x", "waarde": "A"},
        {"label": "13x²", "waarde": "B"},
        {"label": "40x", "waarde": "C"},
        {"label": "5x + 8x (niet verder te herleiden)", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Gelijksoortige termen mag je optellen: 5x + 8x = (5 + 8)x = 13x. Let op: x en x² zijn NIET gelijksoortig.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.13', 2, 'invul',
    'Bereken de getalwaarde van 2x voor x = −3.',
    '-6',
    0.001,
    'Vervang x door −3: 2 · (−3) = −6. Getalwaarde betekent: je vult het getal in op de plaats van de letter en rekent uit.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 2, 'invul',
    'Gebruik de distributieve eigenschap: werk de haakjes weg.<br><br>4 · (x − y) = ?<br><br>Schrijf je antwoord zonder spaties, bv: 4x-4y',
    '4x-4y',
    0,
    'Distributieve eigenschap: 4 · (x − y) = 4·x − 4·y = 4x − 4y. Je vermenigvuldigt de factor 4 met elke term tussen de haakjes.',
    'N1_M08'
);

-- Niveau 3: Analyseren (A) — redeneren, meerdere stappen

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.13', 3, 'invul',
    'Als de getalwaarde van de tweeterm 3x − 1 gelijk is aan 17, hoeveel is dan de getalwaarde van 2x − 4?',
    '8',
    0.001,
    'Stap 1: 3x − 1 = 17 → 3x = 18 → x = 6. Stap 2: vul x = 6 in bij 2x − 4: 2·6 − 4 = 12 − 4 = 8.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'VD1_06.13', 3, 'meerkeuze',
    'Werk de haakjes weg: −3 · (p − 7)',
    '[
        {"label": "−3p + 21", "waarde": "A"},
        {"label": "−3p − 21", "waarde": "B"},
        {"label": "3p − 21", "waarde": "C"},
        {"label": "−3p − 7", "waarde": "D"}
    ]'::jsonb,
    'A',
    '−3 · (p − 7) = −3·p + (−3)·(−7) = −3p + 21. Let op de tekenregel: negatief × negatief = positief, dus (−3)·(−7) = +21.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.16', 3, 'meerkeuze',
    'Een veelterm A(x) heeft graad 2. De coëfficiënt van x² is 1, de term zonder x is −5.<br>Als je de getalwaarde berekent voor x = 2, bekom je 5.<br><br>Welk voorschrift hoort bij A(x)?',
    '[
        {"label": "A(x) = x² + 3x − 5", "waarde": "A"},
        {"label": "A(x) = x² + 4x − 5", "waarde": "B"},
        {"label": "A(x) = x² − x − 5", "waarde": "C"},
        {"label": "A(x) = 2x² + x − 5", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Stel A(x) = x² + bx − 5. Voor x = 2: 4 + 2b − 5 = 5 → 2b − 1 = 5 → 2b = 6 → b = 3.<br>Dus A(x) = x² + 3x − 5. Controle: 2² + 3·2 − 5 = 4 + 6 − 5 = 5. ✅',
    'N2_M05'
);
