-- Fix: unique constraint op resultaten + ontbrekende index
ALTER TABLE resultaten ADD CONSTRAINT IF NOT EXISTS resultaten_sessie_gebied_unique UNIQUE (sessie_id, gebied);
