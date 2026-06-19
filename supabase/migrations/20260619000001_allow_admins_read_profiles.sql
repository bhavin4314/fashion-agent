-- Create helper function to check if the current user is an admin
-- It is declared SECURITY DEFINER to bypass RLS and avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::public.user_role
  );
END;
$$ LANGUAGE plpgsql;

-- Add select policy on profiles table for admin users
CREATE POLICY "Allow admins to select all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());
