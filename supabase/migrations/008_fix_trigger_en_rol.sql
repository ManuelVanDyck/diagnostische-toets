-- Herstel de trigger + zet Manuel's rol goed

-- 1. Trigger herstellen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.leerlingen (id, email, voornaam, naam, rol)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'voornaam', split_part(NEW.email, '.', 1)),
        COALESCE(NEW.raw_user_meta_data->>'naam', split_part(split_part(NEW.email, '@', 1), '.', 2)),
        'leerling'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 2. Voeg jouw record toe (of update als het al bestaat)
INSERT INTO leerlingen (id, email, voornaam, naam, rol)
SELECT id, email,
  split_part(email, '.', 1) as voornaam,
  split_part(split_part(email, '@', 1), '.', 2) as naam,
  'leerkracht' as rol
FROM auth.users
WHERE email LIKE '%@classroomatheneum.be'
ON CONFLICT (id) DO UPDATE SET rol = 'leerkracht';
