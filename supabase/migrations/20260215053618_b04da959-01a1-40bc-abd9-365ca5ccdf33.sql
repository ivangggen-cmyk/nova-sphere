
-- We need to create admin via a function since we can't call auth API from SQL
-- Instead, after the first user registers with admin@atlantic.ru, we'll assign admin role
-- For now, let's create a function that can be used to assign admin role
CREATE OR REPLACE FUNCTION public.make_admin(admin_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
BEGIN
  SELECT id INTO _user_id FROM auth.users WHERE email = admin_email;
  IF _user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;
