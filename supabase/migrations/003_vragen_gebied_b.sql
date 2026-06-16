-- ============================================================================
-- Gebied B: Bewerkingen & Rekenregels — 9 vragen (3 per niveau)
-- Bron: N1_M08 Consolidatie (Nando 1, herwerking 2025)
-- ============================================================================

-- Niveau 1: Begrijpen (B) — eigenschappen herkennen en benoemen

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 1, 1, 'meerkeuze',
    'Welke eigenschap wordt hier beschreven?<br><br><em>"Het vermenigvuldigen in $$\\mathbb{Z}$$ is … , want $$a \\cdot b = b \\cdot a$$ voor alle gehele getallen $$a$$ en $$b$$."</em>',
    '[
        {"label": "Associativiteit", "waarde": "A"},
        {"label": "Commutativiteit", "waarde": "B"},
        {"label": "Distributiviteit", "waarde": "C"},
        {"label": "Neutraal element", "waarde": "D"}
    ]'::jsonb,
    'B',
    'Commutativiteit betekent dat de volgorde van de getallen bij een bewerking niet uitmaakt: $$a \\cdot b = b \\cdot a$$. Bij associativiteit gaat het om de groepering van haakjes.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 1, 1, 'meerkeuze',
    'Welke uitspraak over het getal 0 is <strong>correct</strong>?',
    '[
        {"label": "0 is het neutraal element voor het vermenigvuldigen in $$\\mathbb{Z}$$", "waarde": "A"},
        {"label": "0 is het opslorpend element voor het vermenigvuldigen in $$\\mathbb{Z}$$", "waarde": "B"},
        {"label": "0 is het symmetrisch element voor het optellen in $$\\mathbb{Z}$$", "waarde": "C"},
        {"label": "0 is het neutraal element voor het delen in $$\\mathbb{Z}$$", "waarde": "D"}
    ]'::jsonb,
    'B',
    '0 is het opslorpend element voor de vermenigvuldiging: elk getal vermenigvuldigd met 0 geeft 0. Het neutraal element voor vermenigvuldiging is 1, niet 0.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 1, 1, 'meerkeuze',
    'Wat is de <strong>juiste volgorde van bewerkingen</strong>?<br><br>Rangschik van eerst uit te voeren naar laatst.',
    '[
        {"label": "Haakjes → Machten/Wortels → Vermenigvuldigen/Delen → Optellen/Aftrekken", "waarde": "A"},
        {"label": "Machten/Wortels → Haakjes → Vermenigvuldigen/Delen → Optellen/Aftrekken", "waarde": "B"},
        {"label": "Haakjes → Vermenigvuldigen/Delen → Machten/Wortels → Optellen/Aftrekken", "waarde": "C"},
        {"label": "Vermenigvuldigen/Delen → Haakjes → Machten/Wortels → Optellen/Aftrekken", "waarde": "D"}
    ]'::jsonb,
    'A',
    'De juiste volgorde is: eerst haakjes, dan machten en wortels, dan vermenigvuldigen en delen (van links naar rechts), en als laatste optellen en aftrekken (van links naar rechts).',
    'N1_M08'
);

-- Niveau 2: Toepassen (T) — standaardbewerkingen uitvoeren

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 2, 1, 'meerkeuze',
    'Bereken: $$-3 \\cdot 5 + (-6)$$',
    '[
        {"label": "$$-21$$", "waarde": "A"},
        {"label": "$$9$$", "waarde": "B"},
        {"label": "$$-9$$", "waarde": "C"},
        {"label": "$$21$$", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Volgorde van bewerkingen: eerst vermenigvuldigen: $$-3 \\cdot 5 = -15$$. Dan: $$-15 + (-6) = -21$$.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV1_06.01', 2, 1, 'invul',
    'Bereken: $$(-3 + 5) \\cdot (-6)$$',
    NULL,
    '-12',
    0.001,
    'Eerst de haakjes: $$-3 + 5 = 2$$. Dan: $$2 \\cdot (-6) = -12$$. Een positief getal vermenigvuldigd met een negatief getal geeft een negatief resultaat.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 2, 1, 'meerkeuze',
    'Bereken: $$(-9 + 4) \\cdot (-5)$$<br><br>Gebruik de distributieve eigenschap: $$(a + b) \\cdot c = a \\cdot c + b \\cdot c$$',
    '[
        {"label": "$$25$$", "waarde": "A"},
        {"label": "$$-25$$", "waarde": "B"},
        {"label": "$$65$$", "waarde": "C"},
        {"label": "$$-65$$", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Met distributiviteit: $$(-9) \\cdot (-5) + 4 \\cdot (-5) = 45 + (-20) = 25$$.<br>Of eerst haakjes: $$-9 + 4 = -5$$, dan $$(-5) \\cdot (-5) = 25$$.',
    'N1_M08'
);

-- Niveau 3: Analyseren (A) — meerdere stappen, redeneren

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'VD1_06.01', 3, 1, 'meerkeuze',
    'Toon aan dat het <strong>aftrekken in $$\\mathbb{Z}$$ niet commutatief</strong> is met de getallen $$-4$$ en $$8$$.<br><br>Welke berekening toont dit correct aan?',
    '[
        {"label": "$$-4 - 8 = -12$$ en $$8 - (-4) = 12$$, dus $$-4 - 8 \\neq 8 - (-4)$$", "waarde": "A"},
        {"label": "$$-4 - 8 = 4$$ en $$8 - (-4) = 4$$, dus $$-4 - 8 = 8 - (-4)$$", "waarde": "B"},
        {"label": "$$-4 \\cdot 8 = -32$$ en $$8 \\cdot (-4) = -32$$, dus $$-4 \\cdot 8 = 8 \\cdot (-4)$$", "waarde": "C"},
        {"label": "$$-4 - 8 = -4$$ en $$8 - (-4) = 4$$, dus $$-4 - 8 \\neq 8 - (-4)$$", "waarde": "D"}
    ]'::jsonb,
    'A',
    '$$-4 - 8 = -12$$ en $$8 - (-4) = 8 + 4 = 12$$. De resultaten $$-12$$ en $$12$$ zijn verschillend, dus het aftrekken is niet commutatief. Optie C toont vermenigvuldiging, niet aftrekking.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 1, 'meerkeuze',
    'Bereken: $$(3 + 2^3) \\cdot \\sqrt{81} : 3 - 2$$<br><br>Werk met de juiste volgorde van bewerkingen.',
    '[
        {"label": "$$31$$", "waarde": "A"},
        {"label": "$$13$$", "waarde": "B"},
        {"label": "$$7$$", "waarde": "C"},
        {"label": "$$29$$", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Stap voor stap:<br>1. Haakjes + machten: $$2^3 = 8$$, dus $$3 + 8 = 11$$<br>2. Wortel: $$\\sqrt{81} = 9$$<br>3. Vermenigvuldigen/delen van links: $$11 \\cdot 9 : 3 = 99 : 3 = 33$$<br>4. Aftrekken: $$33 - 2 = 31$$',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, deel, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 3, 1, 'meerkeuze_meervoudig',
    'Beschouw het gedurig product: $$(-2) \\cdot (-2) \\cdot (-2) \\cdot (-2) \\cdot (-2)$$<br><br>Welke uitspraken zijn <strong>juist</strong>? (Meerdere antwoorden mogelijk)',
    '[
        {"label": "Het product is positief", "waarde": "A"},
        {"label": "Het product is negatief", "waarde": "B"},
        {"label": "Het product is $$-32$$", "waarde": "C"},
        {"label": "Het product is $$32$$", "waarde": "D"},
        {"label": "Als het aantal negatieve factoren even is, is het product positief", "waarde": "E"}
    ]'::jsonb,
    'B,C,E',
    'Er zijn 5 negatieve factoren (oneven). Een oneven aantal negatieve factoren geeft een negatief product.<br>$$(-2)^5 = -32$$.<br>Regel: even aantal negatieve factoren → positief; oneven aantal → negatief.',
    'N1_M08'
);
