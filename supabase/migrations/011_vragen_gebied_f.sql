-- ============================================================================
-- Gebied F: Meetkundige formules (omtrek, oppervlakte, volume) — 9 vragen
-- Bron: N1_M04, N2_M05, N2_M17 (Nando)
-- ============================================================================

-- Niveau 1: Begrijpen (B)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.08', 1, 'meerkeuze',
    'Wat is de formule voor de omtrek van een cirkel met straal r?',
    '[
        {"label": "2πr", "waarde": "A"},
        {"label": "πr²", "waarde": "B"},
        {"label": "2r", "waarde": "C"},
        {"label": "πr", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Omtrek cirkel = 2πr (of πd met d = diameter). πr² is de formule voor de oppervlakte van een cirkel.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.08', 1, 'meerkeuze',
    'Wat is de formule voor de oppervlakte van een driehoek?',
    '[
        {"label": "(basis × hoogte) ÷ 2", "waarde": "A"},
        {"label": "basis × hoogte", "waarde": "B"},
        {"label": "basis + hoogte", "waarde": "C"},
        {"label": "2 × basis × hoogte", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Oppervlakte driehoek = (b · h) / 2. De oppervlakte van een rechthoek is wél basis × hoogte, maar een driehoek is de helft daarvan.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.10', 1, 'meerkeuze',
    'Wat is de formule voor het volume van een balk met lengte l, breedte b en hoogte h?',
    '[
        {"label": "V = l · b · h", "waarde": "A"},
        {"label": "V = 2(l · b + l · h + b · h)", "waarde": "B"},
        {"label": "V = l + b + h", "waarde": "C"},
        {"label": "V = (l · b · h) ÷ 3", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Volume balk = lengte × breedte × hoogte. Optie B is de formule voor de oppervlakte van een balk, niet het volume.',
    'N1_M04'
);

-- Niveau 2: Toepassen (T)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.08', 2, 'invul',
    'Een rechthoek heeft lengte 8 cm en breedte 5 cm.<br><br>Bereken de omtrek in cm.',
    '26',
    0.001,
    'Omtrek rechthoek = 2·(l + b) = 2·(8 + 5) = 2·13 = 26 cm.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.08', 2, 'invul',
    'Een cirkel heeft een straal van 3 cm.<br><br>Bereken de oppervlakte in cm². Rond af op 1 decimaal.<br><br>Gebruik π ≈ 3,14.',
    '28.3',
    0.1,
    'Oppervlakte cirkel = πr² = 3,14 · 3² = 3,14 · 9 = 28,26 ≈ 28,3 cm².',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'F', 'BV1_06.10', 2, 'invul',
    'Een balk heeft afmetingen: lengte 10 cm, breedte 4 cm, hoogte 3 cm.<br><br>Bereken het volume in cm³.',
    '120',
    0.001,
    'Volume balk = l · b · h = 10 · 4 · 3 = 120 cm³.',
    'N1_M04'
);

-- Niveau 3: Analyseren (A)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'VD1_06.07', 3, 'meerkeuze',
    'Een figuur is getekend op schaal 1:500. Op de tekening meet de omtrek 12 cm.<br><br>Hoeveel meter is de omtrek in werkelijkheid?',
    '[
        {"label": "60 m", "waarde": "A"},
        {"label": "6 m", "waarde": "B"},
        {"label": "600 m", "waarde": "C"},
        {"label": "0,6 m", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Schaal 1:500 betekent: 1 cm op tekening = 500 cm in werkelijkheid. 12 cm × 500 = 6000 cm = 60 m.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'VD1_06.09', 3, 'meerkeuze',
    'Een kubus heeft een ribbe van 4 cm. Wat is de totale oppervlakte?',
    '[
        {"label": "96 cm²", "waarde": "A"},
        {"label": "64 cm²", "waarde": "B"},
        {"label": "48 cm²", "waarde": "C"},
        {"label": "16 cm²", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Een kubus heeft 6 zijvlakken, elk met oppervlakte 4² = 16 cm². Totale oppervlakte = 6 × 16 = 96 cm². 64 cm³ is het volume (4³), niet de oppervlakte.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'BV 06.05', 3, 'meerkeuze',
    'Een vierkant met zijde 5 cm wordt vergroot met factor 2. Wat gebeurt er met de oppervlakte?',
    '[
        {"label": "De oppervlakte wordt 4× zo groot (100 cm²)", "waarde": "A"},
        {"label": "De oppervlakte wordt 2× zo groot (50 cm²)", "waarde": "B"},
        {"label": "De oppervlakte blijft gelijk", "waarde": "C"},
        {"label": "De oppervlakte wordt 8× zo groot (200 cm²)", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Bij vergroting met factor k: zijde wordt k×, oppervlakte wordt k²×. k = 2, dus oppervlakte wordt 2² = 4× zo groot: 5² = 25 → 4 × 25 = 100 cm².',
    'N2_M05'
);
