-- Gebied C: N4_D5 niveau — Merkwaardige producten

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 4, 'meerkeuze',
    'Werk uit: (x − 4)²',
    '[{"label": "x² − 8x + 16", "waarde": "A"}, {"label": "x² − 16", "waarde": "B"}, {"label": "x² + 8x + 16", "waarde": "C"}, {"label": "x² − 8x − 16", "waarde": "D"}]'::jsonb,
    'A',
    '(x−4)² = x² − 2·x·4 + 4² = x² − 8x + 16.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 4, 'invul',
    'Werk uit: (3x − 2)²<br><br>Schrijf als ...x² − ...x + ... (zonder spaties)',
    '9x^2-12x+4',
    0,
    '(3x−2)² = 9x² − 12x + 4.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 5, 'meerkeuze',
    'Werk uit en herleid: (x + 5)² − 10x',
    '[{"label": "x² + 25", "waarde": "A"}, {"label": "x² + 10x + 25", "waarde": "B"}, {"label": "x² − 10x + 25", "waarde": "C"}, {"label": "x² + 15x + 25", "waarde": "D"}]'::jsonb,
    'A',
    '(x+5)² = x² + 10x + 25. Daarna: x² + 10x + 25 − 10x = x² + 25. De 10x valt weg.',
    'N4_D5_M00'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 5, 'meerkeuze',
    'Ontbind in factoren: a² − 9',
    '[{"label": "(a−3)(a+3)", "waarde": "A"}, {"label": "(a−3)²", "waarde": "B"}, {"label": "(a+3)²", "waarde": "C"}, {"label": "a(a−9)", "waarde": "D"}]'::jsonb,
    'A',
    'a² − 9 = a² − 3² = (a−3)(a+3). Product van toegevoegde tweetermen.',
    'N4_D5_M00'
);
