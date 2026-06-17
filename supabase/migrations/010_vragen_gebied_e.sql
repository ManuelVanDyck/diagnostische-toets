-- ============================================================================
-- Gebied E: Functies — 9 vragen
-- Bron: N1_M04, N1_M13, N1_M17, N2_M05, N2_M17 (Nando)
-- ============================================================================

-- Niveau 1: Begrijpen (B)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV1_06.14', 1, 'meerkeuze',
    'Het punt A heeft als coördinaat (2, 3).<br><br>Hierbij is 2 de ...',
    '[
        {"label": "x-coördinaat", "waarde": "A"},
        {"label": "y-coördinaat", "waarde": "B"},
        {"label": "z-coördinaat", "waarde": "C"},
        {"label": "afstand tot de oorsprong", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Bij een coördinaat (x, y) is het eerste getal altijd de x-coördinaat (horizontaal) en het tweede getal de y-coördinaat (verticaal).',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV1_06.14', 1, 'meerkeuze',
    'In welk kwadrant ligt het punt (−3, 4)?',
    '[
        {"label": "Eerste kwadrant", "waarde": "A"},
        {"label": "Tweede kwadrant", "waarde": "B"},
        {"label": "Derde kwadrant", "waarde": "C"},
        {"label": "Vierde kwadrant", "waarde": "D"}
    ]'::jsonb,
    'B',
    'Punten met x < 0 en y > 0 liggen in het tweede kwadrant (linksboven). Eerste kwadrant: x>0, y>0. Derde: x<0, y<0. Vierde: x>0, y<0.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.12', 1, 'meerkeuze',
    'Een functie kan je op verschillende manieren voorstellen. Welke hoort er NIET bij?',
    '[
        {"label": "Een tabel", "waarde": "A"},
        {"label": "Een grafiek", "waarde": "B"},
        {"label": "Een voorschrift (formule)", "waarde": "C"},
        {"label": "Een getallenas", "waarde": "D"}
    ]'::jsonb,
    'D',
    'Een functie kan je voorstellen met een tabel, grafiek, voorschrift (formule) of verwoording. Een getallenas gebruik je voor het ordenen van getallen, niet voor functies.',
    'N1_M13'
);

-- Niveau 2: Toepassen (T)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'E', 'BV1_06.14', 2, 'invul',
    'Vul de tabel aan voor het verband a = 3n + 1:<br><br>Als n = 4, dan is a = ?',
    '13',
    0.001,
    'a = 3·4 + 1 = 12 + 1 = 13. Het verband tussen volgnummer n en getal a is een eerstegraadsfunctie.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.13', 2, 'meerkeuze',
    'Gegeven de eerstegraadsfunctie f(x) = 2x − 3.<br><br>Wat is het snijpunt met de y-as?',
    '[
        {"label": "(0, −3)", "waarde": "A"},
        {"label": "(0, 2)", "waarde": "B"},
        {"label": "(1,5, 0)", "waarde": "C"},
        {"label": "(0, 3)", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Het snijpunt met de y-as vind je door x = 0 in te vullen: f(0) = 2·0 − 3 = −3. Het punt is (0, −3).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 2, 'meerkeuze',
    'Een temperatuurgrafiek toont het verloop tussen 0 en 24 uur. Om 8u is het 15°C, om 14u is het 30°C.<br><br>Wat kun je zeggen over de temperatuur tussen 8u en 14u?',
    '[
        {"label": "De temperatuur stijgt", "waarde": "A"},
        {"label": "De temperatuur daalt", "waarde": "B"},
        {"label": "De temperatuur blijft gelijk", "waarde": "C"},
        {"label": "Dat kun je niet weten zonder de tussenliggende waarden", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Van 15°C naar 30°C is een stijging. De grafiek toont een stijgend verloop tussen 8u en 14u.',
    'N1_M04'
);

-- Niveau 3: Analyseren (A)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.13', 3, 'meerkeuze',
    'Een eerstegraadsfunctie heeft als voorschrift f(x) = −3x + 6.<br><br>Wat is de nulwaarde?',
    '[
        {"label": "x = 2", "waarde": "A"},
        {"label": "x = −2", "waarde": "B"},
        {"label": "x = 6", "waarde": "C"},
        {"label": "x = −3", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Nulwaarde: los f(x) = 0 op. −3x + 6 = 0 → −3x = −6 → x = 2. De grafiek snijdt de x-as in het punt (2, 0).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 3, 'meerkeuze',
    'Bekijk het verband: een getal wordt verdubbeld en er wordt 5 bij opgeteld. Het resultaat is y.<br><br>Welk voorschrift hoort bij dit verband (met x als invoer)?',
    '[
        {"label": "y = 2x + 5", "waarde": "A"},
        {"label": "y = 5x + 2", "waarde": "B"},
        {"label": "y = x² + 5", "waarde": "C"},
        {"label": "y = 2(x + 5)", "waarde": "D"}
    ]'::jsonb,
    'A',
    '"Verdubbelen" = vermenigvuldigen met 2 → 2x. "Er 5 bij optellen" → 2x + 5. Dus y = 2x + 5.',
    'N1_M13'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 3, 'meerkeuze_meervoudig',
    'Gegeven: f(x) = 2x − 4<br><br>Welke uitspraken zijn juist?',
    '[
        {"label": "De grafiek is een rechte lijn", "waarde": "A"},
        {"label": "De rico (helling) is 2", "waarde": "B"},
        {"label": "Het snijpunt met de y-as is (0, 4)", "waarde": "C"},
        {"label": "De nulwaarde is x = 2", "waarde": "D"},
        {"label": "De functie is dalend", "waarde": "E"}
    ]'::jsonb,
    'A,B,D',
    'f(x)=2x−4 is een eerstegraadsfunctie → rechte lijn ✅. Rico = 2 ✅. Snijpunt y-as: f(0)=−4, dus (0,−4) ❌. Nulwaarde: 2x−4=0 → x=2 ✅. Rico positief → stijgend, niet dalend ❌.',
    'N2_M05'
);
