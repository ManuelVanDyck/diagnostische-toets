-- ============================================================================
-- Gebied G: Goniometrie & Pythagoras — 9 vragen
-- Bron: Nando leerplandoelen BV_06.07, BV2_06.05
-- ============================================================================

-- Niveau 1: Begrijpen (B)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 1, 'meerkeuze',
    'Hoe luidt de stelling van Pythagoras voor een rechthoekige driehoek met schuine zijde c en rechthoekszijden a en b?',
    '[
        {"label": "a² + b² = c²", "waarde": "A"},
        {"label": "a + b = c", "waarde": "B"},
        {"label": "a² − b² = c²", "waarde": "C"},
        {"label": "a · b = c", "waarde": "D"}
    ]'::jsonb,
    'A',
    'In een rechthoekige driehoek geldt: de som van de kwadraten van de rechthoekszijden is gelijk aan het kwadraat van de schuine zijde: a² + b² = c².',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 1, 'meerkeuze',
    'In een rechthoekige driehoek is de sinus van een scherpe hoek gelijk aan:',
    '[
        {"label": "overstaande rechthoekszijde ÷ schuine zijde", "waarde": "A"},
        {"label": "aanliggende rechthoekszijde ÷ schuine zijde", "waarde": "B"},
        {"label": "overstaande rechthoekszijde ÷ aanliggende rechthoekszijde", "waarde": "C"},
        {"label": "schuine zijde ÷ overstaande rechthoekszijde", "waarde": "D"}
    ]'::jsonb,
    'A',
    'SOS CAS TOA: Sinus = Overstaande/Schuine, Cosinus = Aanliggende/Schuine, Tangens = Overstaande/Aanliggende.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 1, 'meerkeuze',
    'Welke zijde is de schuine zijde in een rechthoekige driehoek?',
    '[
        {"label": "De zijde tegenover de rechte hoek", "waarde": "A"},
        {"label": "De langste rechthoekszijde", "waarde": "B"},
        {"label": "De kortste zijde", "waarde": "C"},
        {"label": "De horizontale zijde", "waarde": "D"}
    ]'::jsonb,
    'A',
    'De schuine zijde ligt altijd tegenover de rechte hoek (90°). Het is ook steeds de langste zijde van de driehoek.',
    'N2_M05'
);

-- Niveau 2: Toepassen (T)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 2, 'invul',
    'In een rechthoekige driehoek zijn de rechthoekszijden 3 cm en 4 cm.<br><br>Hoe lang is de schuine zijde in cm?',
    '5',
    0.001,
    'a² + b² = c² → 3² + 4² = 9 + 16 = 25 → c = √25 = 5 cm.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 2, 'invul',
    'Een ladder van 10 m staat tegen een muur. De voet van de ladder staat 6 m van de muur.<br><br>Hoe hoog reikt de ladder tegen de muur in meter?',
    '8',
    0.001,
    '10² = 6² + h² → 100 = 36 + h² → h² = 64 → h = 8 m. De ladder, de muur en de grond vormen een rechthoekige driehoek.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 2, 'invul',
    'In een rechthoekige driehoek is de overstaande rechthoekszijde 8 en de schuine zijde 10.<br><br>Bereken sin(α). Geef je antwoord als decimaal getal.',
    '0.8',
    0.01,
    'sin(α) = overstaande ÷ schuine = 8 ÷ 10 = 0,8.',
    'N2_M05'
);

-- Niveau 3: Analyseren (A)

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 3, 'meerkeuze',
    'Een rechthoek heeft lengte 12 cm en breedte 5 cm. Hoe lang is de diagonaal?',
    '[
        {"label": "13 cm", "waarde": "A"},
        {"label": "17 cm", "waarde": "B"},
        {"label": "7 cm", "waarde": "C"},
        {"label": "√119 cm", "waarde": "D"}
    ]'::jsonb,
    'A',
    'De diagonaal splitst de rechthoek in twee rechthoekige driehoeken. Pythagoras: 12² + 5² = 144 + 25 = 169 → diagonaal = √169 = 13 cm.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 3, 'meerkeuze',
    'In een rechthoekige driehoek is sin(α) = 0,6.<br><br>Hoeveel is cos(α)? Gebruik de grondformule sin²(α) + cos²(α) = 1.',
    '[
        {"label": "0,8", "waarde": "A"},
        {"label": "0,4", "waarde": "B"},
        {"label": "0,64", "waarde": "C"},
        {"label": "0,36", "waarde": "D"}
    ]'::jsonb,
    'A',
    'sin²(α) + cos²(α) = 1 → 0,36 + cos²(α) = 1 → cos²(α) = 0,64 → cos(α) = 0,8 (positief want scherpe hoek).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 3, 'meerkeuze',
    'In een rechthoekige driehoek is tan(α) = 1. Wat weet je over hoek α?',
    '[
        {"label": "α = 45° (de rechthoekszijden zijn even lang)", "waarde": "A"},
        {"label": "α = 30°", "waarde": "B"},
        {"label": "α = 60°", "waarde": "C"},
        {"label": "α = 90°", "waarde": "D"}
    ]'::jsonb,
    'A',
    'tan(α) = overstaande/aanliggende = 1 betekent dat overstaande = aanliggende. Dat is het geval bij een hoek van 45° in een rechthoekige driehoek (gelijkbenig).',
    'N2_M05'
);
