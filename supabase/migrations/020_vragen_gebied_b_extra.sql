-- ============================================================================
-- Gebied B: Extra vragen — rekenregels van machten en vierkantswortels
-- ============================================================================

-- Niveau 1: Begrijpen (B) — rekenregels herkennen

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 1, 'meerkeuze',
    'Wat is de rekenregel voor het product van machten met hetzelfde grondtal?<br><br>a^m · a^n = ?',
    '[{"label": "a^(m+n)", "waarde": "A"}, {"label": "a^(m·n)", "waarde": "B"}, {"label": "a^(m−n)", "waarde": "C"}, {"label": "(a·a)^(m+n)", "waarde": "D"}]'::jsonb,
    'A',
    'Bij vermenigvuldigen van machten met hetzelfde grondtal tel je de exponenten op: a^m · a^n = a^(m+n).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 1, 'meerkeuze',
    'Wat is de rekenregel voor het product van vierkantswortels?<br><br>√a · √b = ? (met a,b ≥ 0)',
    '[{"label": "√(a·b)", "waarde": "A"}, {"label": "√a + √b", "waarde": "B"}, {"label": "√(a+b)", "waarde": "C"}, {"label": "a·b", "waarde": "D"}]'::jsonb,
    'A',
    '√a · √b = √(a·b). Let op: √a + √b is NIET gelijk aan √(a+b).',
    'N2_M05'
);

-- Niveau 2: Toepassen (T) — eenvoudige toepassing van rekenregels

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 2, 'invul',
    'Pas de rekenregel toe: 5^2 · 5^3 = ?<br><br>Schrijf als macht: 5^?',
    '5',
    0.001,
    '5^2 · 5^3 = 5^(2+3) = 5^5. De exponent is 5.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 2, 'meerkeuze',
    'Herleid: (2^3)^2',
    '[{"label": "2^6 = 64", "waarde": "A"}, {"label": "2^5 = 32", "waarde": "B"}, {"label": "2^9 = 512", "waarde": "C"}, {"label": "4^3 = 64", "waarde": "D"}]'::jsonb,
    'A',
    '(2^3)^2 = 2^(3·2) = 2^6 = 64. Macht van een macht: exponenten vermenigvuldigen.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 2, 'invul',
    'Vereenvoudig: √50<br><br>Schrijf als a√b met b zo klein mogelijk. Geef de waarde van b.',
    '2',
    0.001,
    '√50 = √(25·2) = √25 · √2 = 5√2. Dus b = 2.',
    'N2_M05'
);

-- Niveau 3: Toepassen (standaard) — meerdere rekenregels combineren

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 'meerkeuze',
    'Herleid: 3^4 : 3^2',
    '[{"label": "3^2 = 9", "waarde": "A"}, {"label": "3^6 = 729", "waarde": "B"}, {"label": "3^8", "waarde": "C"}, {"label": "1^2 = 1", "waarde": "D"}]'::jsonb,
    'A',
    'Bij delen van machten met hetzelfde grondtal: a^m : a^n = a^(m−n). 3^4 : 3^2 = 3^2 = 9.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 'invul',
    'Schrijf zonder negatieve exponent: 10^(-2) = ?<br><br>Geef je antwoord als een breuk, bv: 1/100',
    '1/100',
    0,
    '10^(-2) = 1/10^2 = 1/100. Een negatieve exponent betekent "één gedeeld door".',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 'meerkeuze',
    'Bereken: √4 · √9 − √36',
    '[{"label": "0", "waarde": "A"}, {"label": "6", "waarde": "B"}, {"label": "−2", "waarde": "C"}, {"label": "12", "waarde": "D"}]'::jsonb,
    'A',
    '√4 = 2, √9 = 3, √36 = 6. Dus 2·3 − 6 = 6 − 6 = 0.',
    'N2_M05'
);

-- Niveau 4: Analyseren

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'meerkeuze',
    'Herleid: (a^2)^3 · a^(-4)',
    '[{"label": "a^2", "waarde": "A"}, {"label": "a^(-2)", "waarde": "B"}, {"label": "a^6", "waarde": "C"}, {"label": "a^10", "waarde": "D"}]'::jsonb,
    'A',
    '(a^2)^3 = a^6. a^6 · a^(-4) = a^(6+(−4)) = a^2.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'invul',
    'Vereenvoudig volledig: √72 + √18<br><br>Schrijf als a√b met b zo klein mogelijk. Geef de waarde van a.',
    '9',
    0.001,
    '√72 = √(36·2) = 6√2. √18 = √(9·2) = 3√2. 6√2 + 3√2 = 9√2. Dus a = 9.',
    'N2_M05'
);

-- Niveau 5: Inzicht

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 5, 'meerkeuze',
    'Als 2^x = 8^3, hoeveel is x?',
    '[{"label": "9", "waarde": "A"}, {"label": "6", "waarde": "B"}, {"label": "11", "waarde": "C"}, {"label": "24", "waarde": "D"}]'::jsonb,
    'A',
    '8^3 = (2^3)^3 = 2^9. Dus 2^x = 2^9 → x = 9.',
    'N2_M05'
);
