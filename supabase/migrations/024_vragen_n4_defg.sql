-- Gebieden D, E, G: N4_D5 niveau vragen

-- ==========================================
-- Gebied D: Vergelijkingen met reële getallen
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 4, 'meerkeuze',
    'Los op: 2x + √10 = √90',
    '[{"label": "x = √10", "waarde": "A"}, {"label": "x = 2√10", "waarde": "B"}, {"label": "x = √80", "waarde": "C"}, {"label": "x = 5√10", "waarde": "D"}]'::jsonb,
    'A',
    '√90 = √(9·10) = 3√10. 2x + √10 = 3√10 → 2x = 2√10 → x = √10.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 5, 'meerkeuze',
    'Los op: 3(π − x) = x − π',
    '[{"label": "x = π", "waarde": "A"}, {"label": "x = 2π", "waarde": "B"}, {"label": "x = 0", "waarde": "C"}, {"label": "x = −π", "waarde": "D"}]'::jsonb,
    'A',
    '3π − 3x = x − π → 3π + π = x + 3x → 4π = 4x → x = π.',
    'N4_D5_M00'
);

-- ==========================================
-- Gebied E: Functies — nulwaarde, functiewaarde
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 4, 'meerkeuze',
    'Gegeven: g(x) = 3x + 6. Hoeveel is het beeld van 2?',
    '[{"label": "12", "waarde": "A"}, {"label": "6", "waarde": "B"}, {"label": "0", "waarde": "C"}, {"label": "36", "waarde": "D"}]'::jsonb,
    'A',
    'g(2) = 3·2 + 6 = 6 + 6 = 12. Het beeld van 2 is de functiewaarde bij x = 2.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 5, 'invul',
    'Gegeven: f(x) = 3x² + 5x − 1<br><br>Bereken f(−2).',
    '1',
    0.001,
    'f(−2) = 3·(−2)² + 5·(−2) − 1 = 3·4 − 10 − 1 = 12 − 11 = 1.',
    'N4_D5_M00'
);

-- ==========================================
-- Gebied G: Pythagoras + Driehoeksmeting N4
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 4, 'meerkeuze',
    'Een cirkel heeft een oppervlakte van 40π cm². Bepaal de lengte van de straal.',
    '[{"label": "2√10 cm", "waarde": "A"}, {"label": "√40 cm", "waarde": "B"}, {"label": "4√10 cm", "waarde": "C"}, {"label": "20 cm", "waarde": "D"}]'::jsonb,
    'A',
    'πr² = 40π → r² = 40 → r = √40 = 2√10 cm.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 5, 'invul',
    'In een rechthoekige driehoek is sin(α) = 0,6. De schuine zijde is 15 cm.<br><br>Bereken de overstaande rechthoekszijde in cm.',
    '9',
    0.001,
    'sin(α) = overstaande/schuine → 0,6 = x/15 → x = 15·0,6 = 9 cm.',
    'N4_D5_M00'
);
