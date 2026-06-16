-- ============================================================================
-- Migratie 002: Automatisch leerlingen-record na signup
-- ============================================================================
-- Let op: e-maildomein restrictie (@classroomatheneum.be) stel je in via:
-- Supabase Dashboard → Authentication → Settings → Allowed email domains
-- ============================================================================

-- Functie: bij nieuwe auth.user → automatisch leerling-record aanmaken
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
        'leerling'  -- default, wordt overschreven door app na login
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger op auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
