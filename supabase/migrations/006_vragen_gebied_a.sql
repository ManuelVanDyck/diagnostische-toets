-- ============================================================================
-- Gebied A: Getallenkennis & verzamelingen — 9 vragen
-- Bron: N1_M04, N1_M08 Consolidatie (Nando)
-- ============================================================================

-- Niveau 1: Begrijpen (B)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.01', 1, 'meerkeuze',
    'N is de verzameling van de ...',
    '[
        {"label": "natuurlijke getallen {0, 1, 2, 3, ...}", "waarde": "A"},
        {"label": "gehele getallen {..., −2, −1, 0, 1, 2, ...}", "waarde": "B"},
        {"label": "rationale getallen (breuken)", "waarde": "C"},
        {"label": "reële getallen", "waarde": "D"}
    ]'::jsonb,
    'A',
    'N = {0, 1, 2, 3, ...} is de verzameling van de natuurlijke getallen. Z is de verzameling van de gehele getallen, Q van de rationale getallen.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.01', 1, 'meerkeuze',
    '−7 is ...',
    '[
        {"label": "een natuurlijk getal", "waarde": "A"},
        {"label": "een geheel getal, maar geen natuurlijk getal", "waarde": "B"},
        {"label": "geen geheel getal", "waarde": "C"},
        {"label": "een rationaal getal, maar geen geheel getal", "waarde": "D"}
    ]'::jsonb,
    'B',
    '−7 is een geheel getal (Z), maar geen natuurlijk getal (N). Natuurlijke getallen zijn 0, 1, 2, 3, ... — alleen positief of nul.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.20', 1, 'meerkeuze',
    'Met A ∪ B bedoel je de ... van verzameling A en verzameling B.',
    '[
        {"label": "unie", "waarde": "A"},
        {"label": "doorsnede", "waarde": "B"},
        {"label": "verschil", "waarde": "C"},
        {"label": "deelverzameling", "waarde": "D"}
    ]'::jsonb,
    'A',
    '∪ = unie (alle elementen samen). ∩ = doorsnede (gemeenschappelijke elementen). \\ = verschil. ⊂ = deelverzameling.',
    'N1_M04'
);

-- Niveau 2: Toepassen (T)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.03', 2, 'meerkeuze',
    'Rangschik van klein naar groot: −211, 112, −121, 122, −112',
    '[
        {"label": "−211 < −121 < −112 < 112 < 122", "waarde": "A"},
        {"label": "−211 < −121 < 112 < −112 < 122", "waarde": "B"},
        {"label": "−211 < −112 < −121 < 112 < 122", "waarde": "C"},
        {"label": "122 < 112 < −112 < −121 < −211", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Negatieve getallen: hoe groter het getal zonder minteken, hoe kleiner de waarde. Dus −211 < −121 < −112, dan de positieve: 112 < 122.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'A', 'VD1_06.02', 2, 'invul',
    'Bepaal ggd(8, 24).',
    '8',
    0.001,
    'Delers van 8: 1, 2, 4, 8. Delers van 24: 1, 2, 3, 4, 6, 8, 12, 24. De grootste gemeenschappelijke deler is 8.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.20', 2, 'meerkeuze',
    'Gegeven: A = {x ∈ N | x is een deler van 18}<br>B = {x ∈ N | x is een veelvoud van 3}<br><br>A ∩ B = ?',
    '[
        {"label": "{3, 6, 9, 18}", "waarde": "A"},
        {"label": "{3, 6, 9}", "waarde": "B"},
        {"label": "{6, 9, 18}", "waarde": "C"},
        {"label": "{1, 2, 3, 6, 9, 18}", "waarde": "D"}
    ]'::jsonb,
    'A',
    'A = {1, 2, 3, 6, 9, 18} (delers van 18).<br>B = {0, 3, 6, 9, 12, 15, 18, ...} (3-vouden).<br>A ∩ B = gemeenschappelijk = {3, 6, 9, 18}.',
    'N1_M04'
);

-- Niveau 3: Analyseren (A)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.20', 3, 'meerkeuze_meervoudig',
    'Gegeven:<br>A: verzameling van oneven natuurlijke getallen kleiner dan 15<br>B: verzameling van drievouden ≤ 15<br><br>Welke uitspraken zijn juist?',
    '[
        {"label": "A = {1, 3, 5, 7, 9, 11, 13}", "waarde": "A"},
        {"label": "B = {0, 3, 6, 9, 12, 15}", "waarde": "B"},
        {"label": "A ∩ B = {3, 9}", "waarde": "C"},
        {"label": "B \\ A = {0, 6, 12, 15}", "waarde": "D"},
        {"label": "6 ∈ A ∩ B", "waarde": "E"}
    ]'::jsonb,
    'A,B,C,D',
    'A: oneven < 15 = {1,3,5,7,9,11,13} ✅<br>B: drievouden ≤ 15 = {0,3,6,9,12,15} ✅<br>A∩B = {3,9} ✅<br>B\\A = elementen van B die niet in A = {0,6,12,15} ✅<br>6 is niet in A (6 is even), dus niet in A∩B ❌',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'VD1_06.02', 3, 'meerkeuze',
    'Noteer door opsomming de natuurlijke getallen met twee cijfers die een priemgetal zijn en waarbij zowel het cijfer van de eenheden als de tientallen ook priemgetallen zijn.<br><br>Priemgetallen: 2, 3, 5, 7',
    '[
        {"label": "{23, 37, 53, 73}", "waarde": "A"},
        {"label": "{22, 23, 25, 27, 32, 33, 35, 37, 52, 53, 55, 57, 72, 73, 75, 77}", "waarde": "B"},
        {"label": "{23, 37, 53, 57, 73}", "waarde": "C"},
        {"label": "{11, 13, 17, 19, 23, 29, 31, 37, ...}", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Stap 1: mogelijke cijfers voor tientallen en eenheden = {2,3,5,7}.<br>Stap 2: alle combinaties hiervan: 22,23,25,27,32,33,35,37,52,53,55,57,72,73,75,77.<br>Stap 3: filter op priemgetal: 23✅, 37✅, 53✅, 73✅. De rest is geen priemgetal.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV 06.02', 3, 'meerkeuze',
    'Welk getal is een irrationaal getal (reëel maar niet rationaal)?',
    '[
        {"label": "√16", "waarde": "A"},
        {"label": "√2", "waarde": "B"},
        {"label": "3/4", "waarde": "C"},
        {"label": "−5", "waarde": "D"}
    ]'::jsonb,
    'B',
    '√2 ≈ 1,4142... is een oneindig, niet-repeterend decimaal getal — dus irrationaal. √16 = 4 (geheel getal). 3/4 = 0,75 (rationaal). −5 (geheel).',
    'N1_M08'
);
