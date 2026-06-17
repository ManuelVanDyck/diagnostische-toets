-- ============================================================================
-- Extra vragen niveau 4 & 5 voor alle 7 gebieden (14 vragen)
-- ============================================================================

-- ==========================================
-- Gebied A: niveau 4 (Analyseren) + 5 (Inzicht)
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'VD1_06.02', 4, 'meerkeuze',
    'Ontbind 84 in priemfactoren.',
    '[
        {"label": "2² · 3 · 7", "waarde": "A"},
        {"label": "2 · 3² · 7", "waarde": "B"},
        {"label": "2³ · 3 · 7", "waarde": "C"},
        {"label": "2² · 3² · 7", "waarde": "D"}
    ]'::jsonb,
    'A',
    '84 = 2·42 = 2·2·21 = 2·2·3·7 = 2²·3·7.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'A', 'VD1_06.02', 5, 'invul',
    'Bepaal ggd(84, 120) met behulp van de priemfactorisatie.<br><br>84 = 2²·3·7<br>120 = 2³·3·5',
    '12',
    0.001,
    'Neem de gemeenschappelijke priemfactoren met de kleinste exponent: 2²·3 = 4·3 = 12.',
    'N1_M04'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'A', 'BV1_06.20', 5, 'meerkeuze',
    'In een klas van 20 leerlingen zitten 12 leerlingen die voetballen (V), 8 die zwemmen (Z) en 5 die beide doen.<br><br>Hoeveel leerlingen doen geen van beide?',
    '[
        {"label": "5", "waarde": "A"},
        {"label": "3", "waarde": "B"},
        {"label": "7", "waarde": "C"},
        {"label": "0", "waarde": "D"}
    ]'::jsonb,
    'A',
    '|V ∪ Z| = |V| + |Z| − |V ∩ Z| = 12 + 8 − 5 = 15. Dus 20 − 15 = 5 leerlingen doen geen van beide.',
    'N1_M04'
);

-- ==========================================
-- Gebied B: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 4, 'meerkeuze',
    'Bereken: 12 : (−3) · 2 + (−4)²',
    '[
        {"label": "8", "waarde": "A"},
        {"label": "−24", "waarde": "B"},
        {"label": "24", "waarde": "C"},
        {"label": "−8", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Volgorde: 1) (−4)² = 16. 2) 12:(−3) = −4. 3) −4·2 = −8. 4) −8 + 16 = 8.',
    'N1_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'B', 'BV 06.03', 5, 'invul',
    'Bereken: (−2)³ · √25 + |−3| · (−1)⁶',
    '-37',
    0.001,
    'Stap voor stap: (−2)³ = −8. √25 = 5. −8·5 = −40. |−3| = 3. (−1)⁶ = 1. 3·1 = 3. −40 + 3 = −37.',
    'N1_M08'
);

-- ==========================================
-- Gebied C: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'C', 'VD1_06.13', 4, 'meerkeuze',
    'Herleid: (x + 3)(x − 2) − x(x + 1)',
    '[
        {"label": "−6", "waarde": "A"},
        {"label": "x² − 6", "waarde": "B"},
        {"label": "x² + x − 6", "waarde": "C"},
        {"label": "2x² + x − 6", "waarde": "D"}
    ]'::jsonb,
    'A',
    '(x+3)(x−2) = x² − 2x + 3x − 6 = x² + x − 6. x(x+1) = x² + x. Verschil: (x²+x−6) − (x²+x) = −6.',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'C', 'BV2_06.11', 5, 'invul',
    'Uit de formule F = 1,8C + 32 (Fahrenheit naar Celsius) druk je C uit in functie van F.<br><br>Schrijf het resultaat als: C = (F − a)/b<br><br>Wat is a?',
    '32',
    0.001,
    'F = 1,8C + 32 → F − 32 = 1,8C → C = (F − 32)/1,8. Dus a = 32.',
    'N2_M05'
);

-- ==========================================
-- Gebied D: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 4, 'invul',
    'Los op: 3(x − 2) = 2x + 5<br><br>x = ?',
    '11',
    0.001,
    '3x − 6 = 2x + 5 → 3x − 2x = 5 + 6 → x = 11. Controle: 3(9) = 27 en 22+5 = 27 ✅.',
    'N2_M08'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'D', 'BV2_06.10', 5, 'meerkeuze',
    'Twee getallen verschillen 7. Hun som is 31.<br><br>Wat is het kleinste getal?',
    '[
        {"label": "12", "waarde": "A"},
        {"label": "19", "waarde": "B"},
        {"label": "14", "waarde": "C"},
        {"label": "24", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Stel x = kleinste, dan x+7 = grootste. x + (x+7) = 31 → 2x = 24 → x = 12. Grootste = 19. Controle: 19−12=7 ✅ 19+12=31 ✅.',
    'N2_M08'
);

-- ==========================================
-- Gebied E: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.14', 4, 'meerkeuze',
    'Gegeven f(x) = −2x + 6. Voor welke x-waarden is f(x) > 0?',
    '[
        {"label": "x < 3", "waarde": "A"},
        {"label": "x > 3", "waarde": "B"},
        {"label": "x < −3", "waarde": "C"},
        {"label": "Voor alle x", "waarde": "D"}
    ]'::jsonb,
    'A',
    'f(x) > 0 → −2x + 6 > 0 → −2x > −6 → x < 3 (teken draait om bij delen door negatief getal!).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'E', 'BV2_06.13', 5, 'meerkeuze',
    'Twee eerstegraadsfuncties snijden elkaar in het punt (2, 5). Functie f heeft rico 3.<br>Functie g heeft rico −1.<br><br>Wat is het voorschrift van f?',
    '[
        {"label": "f(x) = 3x − 1", "waarde": "A"},
        {"label": "f(x) = 3x + 5", "waarde": "B"},
        {"label": "f(x) = 3x − 5", "waarde": "C"},
        {"label": "f(x) = 3x + 11", "waarde": "D"}
    ]'::jsonb,
    'A',
    'f(x) = 3x + b. Door (2,5): 5 = 3·2 + b → 5 = 6 + b → b = −1. Dus f(x) = 3x − 1.',
    'N2_M05'
);

-- ==========================================
-- Gebied F: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'F', 'VD1_06.07', 4, 'invul',
    'Een L-vormig terras bestaat uit een rechthoek van 8 m × 5 m en een aangebouwde rechthoek van 3 m × 2 m die elkaar overlappen in een vierkant van 2 m × 2 m.<br><br>Wat is de totale oppervlakte in m²?',
    '46',
    0.001,
    'Rechthoek 1: 8·5 = 40. Rechthoek 2: 3·2 = 6. Overlap: 2·2 = 4. Totaal = 40 + 6 − 4 = 46 m² (overlap niet dubbel tellen).',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'F', 'BV 06.05', 5, 'meerkeuze',
    'Een balk van 4 cm × 3 cm × 2 cm wordt vergroot met factor 3.<br><br>Wat gebeurt er met het volume?',
    '[
        {"label": "Het volume wordt 27× zo groot", "waarde": "A"},
        {"label": "Het volume wordt 9× zo groot", "waarde": "B"},
        {"label": "Het volume wordt 3× zo groot", "waarde": "C"},
        {"label": "Het volume blijft gelijk", "waarde": "D"}
    ]'::jsonb,
    'A',
    'Volume is 3D: alle afmetingen worden 3×, dus volume wordt 3³ = 27× zo groot. Oorspronkelijk: 4·3·2 = 24 cm³. Nieuw: 12·9·6 = 648 = 27·24 cm³.',
    'N2_M05'
);

-- ==========================================
-- Gebied G: niveau 4 + 5
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, juist_antwoord, tolerantie, uitleg_html, bron_module)
VALUES (
    'G', 'BV2_06.05', 4, 'invul',
    'Een rechthoekige driehoek heeft een schuine zijde van 13 cm en één rechthoekszijde van 5 cm.<br><br>Bereken de oppervlakte van de driehoek in cm².<br><br>(Tip: bereken eerst de andere rechthoekszijde)',
    '30',
    0.001,
    'Andere rechthoekszijde b: 5² + b² = 13² → 25 + b² = 169 → b² = 144 → b = 12. Oppervlakte = (5·12)/2 = 30 cm².',
    'N2_M05'
);

INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES (
    'G', 'BV_06.07', 5, 'meerkeuze',
    'In een rechthoekige driehoek is sin(α) = 5/13. De schuine zijde is 13 cm.<br><br>Bereken tan(α).',
    '[
        {"label": "5/12", "waarde": "A"},
        {"label": "5/13", "waarde": "B"},
        {"label": "12/5", "waarde": "C"},
        {"label": "12/13", "waarde": "D"}
    ]'::jsonb,
    'A',
    'sin(α) = overstaande/schuine = 5/13 → overstaande = 5, schuine = 13. Pythagoras: aanliggende = √(169−25) = √144 = 12. tan(α) = 5/12.',
    'N2_M05'
);
