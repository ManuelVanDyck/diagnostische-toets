-- ============================================================================
-- Gebied B: Bewerkingen & Rekenregels — 9 vragen (3 per niveau)
-- Bron: N1_M08 Consolidatie (Nando 1, herwerking 2025)
-- ============================================================================

-- Niveau 1: Begrijpen (B) — eigenschappen herkennen en benoemen

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 1, 'meerkeuze',
    'Welke eigenschap wordt hier beschreven?<br><br><em>"Het vermenigvuldigen in Z is … , want a · b = b · a voor alle gehele getallen a en b."</em>',
    '[
        {"label": "Associativiteit", "waarde": "A"},
        {"label": "Commutativiteit", "waarde": "B"},
        {"label": "Distributiviteit", "waarde": "C"},
        {"label": "Neutraal element", "waarde": "D"}
    ]'::jsonb,
    'B',
    'Commutativiteit betekent dat de volgorde van de getallen bij een vermenigvuldiging niet uitmaakt: a · b = b · a.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 1, 'meerkeuze',
    'Welke uitspraak over het getal 0 is correct?',
    '[
        {"label": "0 is het neutraal element voor het vermenigvuldigen", "waarde": "A"},
        {"label": "0 is het opslorpend element voor het vermenigvuldigen", "waarde": "B"},
        {"label": "0 is het symmetrisch element voor het optellen", "waarde": "C"},
        {"label": "0 is het neutraal element voor het delen", "waarde": "D"}
    ]'::jsonb,
    'B',
    '0 is het opslorpend element voor de vermenigvuldiging: elk getal × 0 = 0. Het neutraal element voor vermenigvuldiging is 1.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 1, 'meerkeuze',
    'Wat is de juiste volgorde van bewerkingen?<br><br>Rangschik van eerst uit te voeren naar laatst.',
    '[
        {"label": "Haakjes → Machten/Wortels → × en : → + en −", "waarde": "A"},
        {"label": "Machten/Wortels → Haakjes → × en : → + en −", "waarde": "B"},
        {"label": "Haakjes → × en : → Machten/Wortels → + en −", "waarde": "C"},
        {"label": "× en : → Haakjes → Machten/Wortels → + en −", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Juiste volgorde: eerst haakjes, dan machten en wortels, dan vermenigvuldigen en delen (van links naar rechts), en als laatste optellen en aftrekken.',
    'N1_M08'
);

-- Niveau 2: Toepassen (T) — standaardbewerkingen uitvoeren

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 2, 'meerkeuze',
    'Bereken: −3 · 5 + (−6)',
    '[
        {"label": "−21", "waarde": "A"},
        {"label": "9", "waarde": "B"},
        {"label": "−9", "waarde": "C"},
        {"label": "21", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Volgorde van bewerkingen: eerst vermenigvuldigen: −3 · 5 = −15. Dan: −15 + (−6) = −21.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 2, 'invul',
    'Bereken: (−3 + 5) · (−6)',
    '-12',
    0.001,
    'Eerst de haakjes: −3 + 5 = 2. Dan: 2 · (−6) = −12. Positief × negatief = negatief.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 2, 'meerkeuze',
    'Bereken met de distributieve eigenschap: (−9 + 4) · (−5)',
    '[
        {"label": "25", "waarde": "A"},
        {"label": "−25", "waarde": "B"},
        {"label": "65", "waarde": "C"},
        {"label": "−65", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Met distributiviteit: (−9)·(−5) + 4·(−5) = 45 + (−20) = 25. Of eerst haakjes: (−5)·(−5) = 25.',
    'N1_M08'
);

-- Niveau 3: Analyseren (A) — meerdere stappen, redeneren

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 3, 'meerkeuze',
    'Toon aan dat aftrekken niet commutatief is met −4 en 8. Welke berekening toont dit correct aan?',
    '[
        {"label": "−4 − 8 = −12 en 8 − (−4) = 12, dus −4 − 8 ≠ 8 − (−4)", "waarde": "A"},
        {"label": "−4 − 8 = 4 en 8 − (−4) = 4, dus ze zijn gelijk", "waarde": "B"},
        {"label": "−4 · 8 = −32 en 8 · (−4) = −32 (toont vermenigvuldiging)", "waarde": "C"},
        {"label": "−4 − 8 = −4 en 8 − (−4) = 4", "waarde": "D"}
    ]'::jsonb,
    'A',
    '−4 − 8 = −12 en 8 − (−4) = 12. Verschillende resultaten → aftrekken is niet commutatief.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 'meerkeuze',
    'Bereken: (3 + 2³) · √81 : 3 − 2. Werk met de juiste volgorde van bewerkingen.',
    '[
        {"label": "31", "waarde": "A"},
        {"label": "13", "waarde": "B"},
        {"label": "7", "waarde": "C"},
        {"label": "29", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Stap voor stap: 1) 2³=8, dus 3+8=11 2) √81=9 3) 11·9:3=99:3=33 4) 33−2=31',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 'meerkeuze_meervoudig',
    'Beschouw: (−2) · (−2) · (−2) · (−2) · (−2). Welke uitspraken zijn juist?',
    '[
        {"label": "Het product is positief", "waarde": "A"},
        {"label": "Het product is negatief", "waarde": "B"},
        {"label": "Het product is −32", "waarde": "C"},
        {"label": "Het product is 32", "waarde": "D"},
        {"label": "Bij een oneven aantal negatieve factoren is het product negatief", "waarde": "E"}
    ]'::jsonb,
    'B,C,E',
    '5 negatieve factoren (oneven) → product is negatief. (−2)⁵ = −32. Regel: even aantal negatieve factoren → positief; oneven → negatief.',
    'N1_M08'
);
