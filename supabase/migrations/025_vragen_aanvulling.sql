-- Aanvulling: minimaal 5 vragen per niveau per gebied

-- ==========================================
-- Gebied A: +8 vragen (niv 1-3 +2, niv 4 +3)
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('A', 'BV1_06.01', 1, 'meerkeuze', 'Welke getallenverzameling bevat negatieve getallen?', '[{"label": "N", "waarde": "A"}, {"label": "Z", "waarde": "B"}, {"label": "ℕ₀", "waarde": "C"}, {"label": "Enkel N en Z niet", "waarde": "D"}]'::jsonb, 'B', 'Z = {..., −2, −1, 0, 1, 2, ...} bevat negatieve getallen. N = {0, 1, 2, ...} bevat enkel positieve en nul.', 'N4_D5_M00'),
('A', 'BV1_06.01', 1, 'meerkeuze', 'Welk symbool betekent "is een element van"?', '[{"label": "⊂", "waarde": "A"}, {"label": "∈", "waarde": "B"}, {"label": "∪", "waarde": "C"}, {"label": "∩", "waarde": "D"}]'::jsonb, 'B', '∈ = is element van. ⊂ = is deelverzameling van. ∪ = unie. ∩ = doorsnede.', 'N4_D5_M00'),
('A', 'BV1_06.03', 2, 'meerkeuze', 'Noteer door opsomming: A = {x ∈ N | x is een volkomen kwadraat ≤ 25}', '[{"label": "{0, 1, 4, 9, 16, 25}", "waarde": "A"}, {"label": "{1, 4, 9, 16, 25}", "waarde": "B"}, {"label": "{0, 1, 4, 9, 16}", "waarde": "C"}, {"label": "{1, 2, 3, 4, 5}", "waarde": "D"}]'::jsonb, 'A', 'Volkomen kwadraten zijn 0²=0, 1²=1, 2²=4, 3²=9, 4²=16, 5²=25. Alle ≤ 25, inclusief 0 want 0 ∈ N.', 'N4_D5_M00'),
('A', 'BV1_06.20', 2, 'meerkeuze', 'P = {priemgetallen < 20}. R = {delers van 30}. Bepaal P ∩ R.', '[{"label": "{2, 3, 5}", "waarde": "A"}, {"label": "{2, 3, 5, 10, 15}", "waarde": "B"}, {"label": "{1, 2, 3, 5}", "waarde": "C"}, {"label": "{2, 5}", "waarde": "D"}]'::jsonb, 'A', 'P = {2,3,5,7,11,13,17,19}. R = {1,2,3,5,6,10,15,30}. P∩R = {2,3,5}.', 'N4_D5_M00'),
('A', 'BV1_06.20', 3, 'meerkeuze', 'A = volkomen kwadraten ≤ 100. B = viervouden < 100. Is 8 ∈ A \\ B?', '[{"label": "Ja, 8 zit in A maar niet in B", "waarde": "A"}, {"label": "Nee, 8 zit niet in A", "waarde": "B"}, {"label": "Nee, 8 zit in zowel A als B", "waarde": "C"}, {"label": "Ja, 8 zit in B maar niet in A", "waarde": "D"}]'::jsonb, 'B', 'A = {0,1,4,9,16,25,36,49,64,81,100}. 8 is geen volkomen kwadraat, dus 8 ∉ A. Dan automatisch ook 8 ∉ A\\B.', 'N4_D5_M00'),
('A', 'BV1_06.20', 3, 'meerkeuze', 'Priemgetallen kleiner dan 10 zijn {2,3,5,7}. Zijn alle priemgetallen <10 oneven?', '[{"label": "Nee, 2 is een priemgetal en even", "waarde": "A"}, {"label": "Ja, alle priemgetallen zijn oneven", "waarde": "B"}, {"label": "Ja, behalve 1", "waarde": "C"}, {"label": "Nee, 0 is ook een priemgetal", "waarde": "D"}]'::jsonb, 'A', '2 is het enige even priemgetal. Alle andere priemgetallen zijn oneven. 1 is geen priemgetal.', 'N4_D5_M00'),
('A', 'VD1_06.02', 4, 'invul', 'Gegeven: 8 ∈ A\\B, A = volkomen kwadraten ≤ 100, B = viervouden < 100. Is dit waar of niet? Antwoord met 1 (waar) of 0 (niet waar).', '0', 0, 'A = {0,1,4,9,16,25,36,49,64,81,100}. B = {0,4,8,12,...,96}. 8 ∉ A (8 is geen kwadraat), dus kan 8 niet in A\\B zitten.', 'N4_D5_M00'),
('A', 'BV1_06.20', 4, 'meerkeuze', 'A ∩ B = {4, 16, 36, 64, 100}. Is dit correct als A = kwadraten ≤ 100, B = viervouden < 100?', '[{"label": "Ja, gemeenschappelijke elementen kloppen", "waarde": "A"}, {"label": "Nee, 0 ontbreekt", "waarde": "B"}, {"label": "Nee, 4 is geen viervoud", "waarde": "C"}, {"label": "Nee, 100 is niet < 100", "waarde": "D"}]'::jsonb, 'B', 'A = {0,1,4,9,16,25,36,49,64,81,100}. B = {0,4,8,...,96}. A∩B = {0,4,16,36,64}. 0 ontbreekt in de gegeven set, en 100 zit niet in B (want B < 100).', 'N4_D5_M00');

-- ==========================================
-- Gebied C: niv 1-2 +2
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('C', 'BV1_06.11', 1, 'meerkeuze', 'Uit hoeveel termen bestaat de veelterm 3x² − 5x + 2?', '[{"label": "3", "waarde": "A"}, {"label": "2", "waarde": "B"}, {"label": "1", "waarde": "C"}, {"label": "4", "waarde": "D"}]'::jsonb, 'A', 'De veelterm bestaat uit drie termen: 3x², −5x en 2. Dit noemen we een drieterm.', 'N4_D5_M00'),
('C', 'BV1_06.11', 1, 'meerkeuze', 'Wat is de coëfficiënt van x in de veelterm 4x² − 3x + 7?', '[{"label": "4", "waarde": "A"}, {"label": "−3", "waarde": "B"}, {"label": "7", "waarde": "C"}, {"label": "3", "waarde": "D"}]'::jsonb, 'B', 'De coëfficiënt van x is −3. De 4 hoort bij x², de 7 is de constante term.', 'N4_D5_M00'),
('C', 'BV1_06.13', 2, 'invul', 'Bereken de getalwaarde van 3x² − 2x + 1 voor x = −1.', '6', 0.001, '3·(−1)² − 2·(−1) + 1 = 3·1 + 2 + 1 = 6.', 'N4_D5_M00'),
('C', 'BV1_06.12', 2, 'meerkeuze', 'Herleid: 7a − 3b − 2a + 5b', '[{"label": "5a + 2b", "waarde": "A"}, {"label": "5a + 8b", "waarde": "B"}, {"label": "9a + 2b", "waarde": "C"}, {"label": "7a + 2b", "waarde": "D"}]'::jsonb, 'A', '7a − 2a = 5a. −3b + 5b = 2b. Resultaat: 5a + 2b.', 'N4_D5_M00');

-- ==========================================
-- Gebied D: niv 1-3 +2
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('D', 'BV1_06.17', 1, 'meerkeuze', 'In de vergelijking 2x − 8 = 20 noemen we 2x − 8 het ...', '[{"label": "Linkerlid", "waarde": "A"}, {"label": "Rechterlid", "waarde": "B"}, {"label": "De oplossing", "waarde": "C"}, {"label": "De onbekende", "waarde": "D"}]'::jsonb, 'A', 'Het gedeelte links van het gelijkteken is het linkerlid. Het gedeelte rechts is het rechterlid.', 'N4_D5_M00'),
('D', 'BV1_06.17', 2, 'meerkeuze', 'Los op: 6 meer dan het dubbel van een getal is 20. Welk getal is dat?', '[{"label": "7", "waarde": "A"}, {"label": "10", "waarde": "B"}, {"label": "14", "waarde": "C"}, {"label": "13", "waarde": "D"}]'::jsonb, 'A', '2x + 6 = 20 → 2x = 14 → x = 7.', 'N4_D5_M00'),
('D', 'BV1_06.17', 3, 'meerkeuze', 'Los op: (4x − 3)·2 = 3x − (4 − 5x)', '[{"label": "x = −1/3", "waarde": "A"}, {"label": "x = 1", "waarde": "B"}, {"label": "x = −1", "waarde": "C"}, {"label": "Geen oplossing", "waarde": "D"}]'::jsonb, 'D', '8x−6 = 3x−4+5x → 8x−6 = 8x−4 → −6 = −4. Dit is vals, dus geen oplossing (strijdige vergelijking).', 'N4_D5_M00');

-- ==========================================
-- Gebied E: niv 4-5 +2
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('E', 'BV2_06.14', 4, 'meerkeuze', 'Als h(t) de hoogte van een projectiel is na t seconden, wat betekent h(2) = 4,2?', '[{"label": "Na 2 seconden is de hoogte 4,2 meter", "waarde": "A"}, {"label": "Na 4,2 seconden is de hoogte 2 meter", "waarde": "B"}, {"label": "De gemiddelde hoogte is 4,2 meter", "waarde": "C"}, {"label": "De maximale hoogte is 4,2 meter", "waarde": "D"}]'::jsonb, 'A', 'h(2) betekent: de functiewaarde bij t = 2. Dus na 2 seconden is het projectiel 4,2 meter hoog.', 'N4_D5_M00'),
('E', 'BV2_06.13', 5, 'meerkeuze', 'Gegeven: f(x) = −x² + 3x − 1. Controleer of 1 een nulwaarde is.', '[{"label": "Ja, f(1) = 1", "waarde": "A"}, {"label": "Ja, f(1) = 0", "waarde": "B"}, {"label": "Nee, f(1) = 1", "waarde": "C"}, {"label": "Nee, f(1) = −5", "waarde": "D"}]'::jsonb, 'C', 'f(1) = −1² + 3·1 − 1 = −1 + 3 − 1 = 1. f(1) ≠ 0, dus 1 is geen nulwaarde.', 'N4_D5_M00');

-- ==========================================
-- Gebied F: niv 4-5 +3
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('F', 'VD1_06.07', 4, 'meerkeuze', 'Een cirkel heeft oppervlakte 40 cm². Wat is de straal? (gebruik π ≈ 3,14)', '[{"label": "≈ 3,57 cm", "waarde": "A"}, {"label": "≈ 6,37 cm", "waarde": "B"}, {"label": "≈ 12,74 cm", "waarde": "C"}, {"label": "≈ 1,78 cm", "waarde": "D"}]'::jsonb, 'A', 'πr² = 40 → r² = 40/3,14 ≈ 12,74 → r ≈ 3,57 cm.', 'N4_D5_M00'),
('F', 'VD1_06.09', 5, 'meerkeuze', 'Een grote kubus (zijde 8 cm) wordt gevuld met kleine kubusjes (volume 0,512 cm³). Hoeveel kleine kubusjes passen er maximaal in?', '[{"label": "1000", "waarde": "A"}, {"label": "125", "waarde": "B"}, {"label": "800", "waarde": "C"}, {"label": "512", "waarde": "D"}]'::jsonb, 'A', 'Volume grote kubus = 8³ = 512 cm³. Aantal kleine = 512 ÷ 0,512 = 1000. Of: kleine zijde = ∛0,512 = 0,8 cm. 8/0,8 = 10 per rij, totaal 10³ = 1000.', 'N4_D5_M00'),
('F', 'BV 06.05', 5, 'meerkeuze', 'Een rechthoek van 5×8 cm wordt vergroot tot 15×24 cm. Wat is de vergrotingsfactor?', '[{"label": "3", "waarde": "A"}, {"label": "2", "waarde": "B"}, {"label": "4", "waarde": "C"}, {"label": "9", "waarde": "D"}]'::jsonb, 'A', '15/5 = 3, 24/8 = 3. Beide zijden worden 3× zo groot. De oppervlakte wordt 3² = 9× zo groot.', 'N4_D5_M00');

-- ==========================================
-- Gebied G: niv 4-5 +2
-- ==========================================
INSERT INTO vragen (gebied, leerplandoel, niveau, type, vraag_html, keuzes_json, juist_antwoord, uitleg_html, bron_module)
VALUES 
('G', 'BV2_06.05', 4, 'meerkeuze', 'Een gelijkbenige rechthoekige driehoek heeft een schuine zijde van √32 cm. Hoe lang zijn de rechthoekszijden?', '[{"label": "4 cm", "waarde": "A"}, {"label": "8 cm", "waarde": "B"}, {"label": "√16 cm", "waarde": "C"}, {"label": "2√8 cm", "waarde": "D"}]'::jsonb, 'A', 'Beide rechthoekszijden zijn even lang (gelijkbenig). a² + a² = (√32)² → 2a² = 32 → a² = 16 → a = 4 cm.', 'N4_D5_M00'),
('G', 'BV_06.07', 5, 'meerkeuze', 'In een rechthoekige driehoek is tan(α) = 3/4 en de schuine zijde is 25 cm. Wat is de aanliggende rechthoekszijde?', '[{"label": "20 cm", "waarde": "A"}, {"label": "15 cm", "waarde": "B"}, {"label": "12 cm", "waarde": "C"}, {"label": "16 cm", "waarde": "D"}]'::jsonb, 'A', 'tan=ov/aan=3/4, dus ov=3k, aan=4k. Pythagoras: (3k)²+(4k)²=25² → 9k²+16k²=625 → k²=25 → k=5. Aanliggende = 4·5 = 20 cm.', 'N4_D5_M00');
