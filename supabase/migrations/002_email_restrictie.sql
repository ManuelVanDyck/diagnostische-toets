-- ============================================================================
-- Migratie 002: E-maildomein restrictie @classroomatheneum.be
-- ============================================================================

-- Functie die nieuwe auth.users valideert op e-maildomein
CREATE OR REPLACE FUNCTION auth.check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email NOT LIKE '%@classroomatheneum.be' THEN
        RAISE EXCEPTION 'Alleen @classroomatheneum.be e-mailadressen zijn toegestaan.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger op auth.users: bij INSERT checken we het domein
DROP TRIGGER IF EXISTS check_email_domain_trigger ON auth.users;
CREATE TRIGGER check_email_domain_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.check_email_domain();

-- Na signup: automatisch leerling-record aanmaken (rol komt later via app)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.leerlingen (id, email, voornaam, naam, rol)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'voornaam', split_part(NEW.email, '.', 1)),
        COALESCE(NEW.raw_user_meta_data->>'naam', split_part(split_part(NEW.email, '@', 1), '.', 2)),
        COALESCE(NEW.raw_user_meta_data->>'rol', 'leerling')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: bij nieuwe auth.user → automatisch in leerlingen
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
