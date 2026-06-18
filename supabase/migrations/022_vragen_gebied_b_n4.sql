-- Gebied B: N4_D5 niveau vragen (correcte versie)

-- Niveau 4
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'meerkeuze',
    'Vereenvoudig: √27',
    '[{"label": "3√3", "waarde": "A"}, {"label": "9√3", "waarde": "B"}, {"label": "9", "waarde": "C"}, {"label": "√3", "waarde": "D"}]'::jsonb,
    'A',
    '√27 = √(9·3) = √9 · √3 = 3√3.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'meerkeuze',
    'Reken uit: √2 · (√8 + 1)',
    '[{"label": "4 + √2", "waarde": "A"}, {"label": "√10 + √2", "waarde": "B"}, {"label": "5", "waarde": "C"}, {"label": "4√2", "waarde": "D"}]'::jsonb,
    'A',
    '√2·√8 + √2·1 = √16 + √2 = 4 + √2. Of: √8 = 2√2, dus √2·(2√2+1) = 2·2 + √2 = 4+√2.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'meerkeuze',
    'Reken uit: (6 − √15) · √5 + (√5)²',
    '[{"label": "6√5 − 5√3 + 5", "waarde": "A"}, {"label": "6√5 − 5√3", "waarde": "B"}, {"label": "11", "waarde": "C"}, {"label": "6√5 + 5", "waarde": "D"}]'::jsonb,
    'A',
    '(6−√15)·√5 + 5 = 6√5 − √(15·5) + 5 = 6√5 − √75 + 5 = 6√5 − 5√3 + 5.',
    'N4_D5_M00'
);

-- Niveau 5
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 5, 'meerkeuze',
    'Vereenvoudig: 3√12 − 2√75',
    '[{"label": "−4√3", "waarde": "A"}, {"label": "4√3", "waarde": "B"}, {"label": "−40√3", "waarde": "C"}, {"label": "√3", "waarde": "D"}]'::jsonb,
    'A',
    '3√12 = 3·2√3 = 6√3. 2√75 = 2·5√3 = 10√3. 6√3 − 10√3 = −4√3.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 5, 'meerkeuze',
    'Vereenvoudig: (2√3 + 1) / √3',
    '[{"label": "2 + √3/3", "waarde": "A"}, {"label": "2√3", "waarde": "B"}, {"label": "2 + 1/√3", "waarde": "C"}, {"label": "3/√3", "waarde": "D"}]'::jsonb,
    'A',
    '(2√3+1)/√3 = 2√3/√3 + 1/√3 = 2 + 1/√3 = 2 + √3/3.',
    'N4_D5_M00'
);
