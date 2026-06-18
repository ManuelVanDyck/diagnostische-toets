-- Gebied C: Extra vragen — merkwaardige producten
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 3, 'meerkeuze',
    'Wat is de correcte uitwerking van (a + b)^2?',
    '[{"label": "a^2 + 2ab + b^2", "waarde": "A"}, {"label": "a^2 + b^2", "waarde": "B"}, {"label": "a^2 + ab + b^2", "waarde": "C"}, {"label": "2a + 2b", "waarde": "D"}]'::jsonb,
    'A',
    '(a+b)^2 = (a+b)(a+b) = a^2 + ab + ba + b^2 = a^2 + 2ab + b^2. Dit is een merkwaardig product.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 4, 'invul',
    'Werk uit: (x + 3)^2<br><br>Schrijf als: x^2 + ...x + ... (zonder spaties, bv: x^2+6x+9)',
    'x^2+6x+9',
    0,
    '(x+3)^2 = x^2 + 2·x·3 + 3^2 = x^2 + 6x + 9.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 4, 'invul',
    'Werk uit: (2a − 5)^2<br><br>Schrijf als: ...a^2 − ...a + ... (zonder spaties)',
    '4a^2-20a+25',
    0,
    '(2a−5)^2 = (2a)^2 − 2·2a·5 + 5^2 = 4a^2 − 20a + 25.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'BV1_06.12', 5, 'meerkeuze',
    'Ontbind in factoren: x^2 − 25',
    '[{"label": "(x−5)(x+5)", "waarde": "A"}, {"label": "(x−5)^2", "waarde": "B"}, {"label": "(x+5)^2", "waarde": "C"}, {"label": "(x−5)(x−5)", "waarde": "D"}]'::jsonb,
    'A',
    'x^2 − 25 = x^2 − 5^2 = (x−5)(x+5). Dit is het merkwaardig product a^2 − b^2 = (a−b)(a+b).',
    'N2_M05'
);
