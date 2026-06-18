-- Fix: antwoorden_stap_check toelaten tot 10 (voor 5 niveaus × 2 herkansingen)
ALTER TABLE antwoorden DROP CONSTRAINT IF EXISTS antwoorden_stap_check;
ALTER TABLE antwoorden ADD CONSTRAINT antwoorden_stap_check CHECK (stap >= 1 AND stap <= 10);
