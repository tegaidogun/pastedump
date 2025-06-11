/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Enable RLS on the pastes table
  pgm.sql('ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;');

  // Allow public read access to all pastes
  pgm.sql(`
    CREATE POLICY "Allow public read access"
    ON public.pastes
    FOR SELECT
    USING (true);
  `);

  // Allow anyone to insert a new paste
  pgm.sql(`
    CREATE POLICY "Allow anonymous inserts"
    ON public.pastes
    FOR INSERT
    WITH CHECK (true);
  `);

  // Enable RLS on the pgmigrations table
  pgm.sql('ALTER TABLE public.pgmigrations ENABLE ROW LEVEL SECURITY;');

  // Policy for pgmigrations: only allow admin access
  pgm.sql(`
    CREATE POLICY "Allow full access to postgres role"
    ON public.pgmigrations
    FOR ALL
    TO postgres
    USING (true)
    WITH CHECK (true);
  `);

  // Fix function search path and make it SECURITY DEFINER
  pgm.sql(`
    CREATE OR REPLACE FUNCTION public.increment_view_count(paste_short_id text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
    BEGIN
      UPDATE public.pastes
      SET view_count = view_count + 1
      WHERE short_id = paste_short_id;
    END;
    $$;
  `);

  pgm.sql(`
    CREATE POLICY "Allow update for view count"
    ON public.pastes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP POLICY IF EXISTS "Allow update for view count" ON public.pastes;');
  // Revert increment_view_count function to its original state
  pgm.sql(`
    CREATE OR REPLACE FUNCTION public.increment_view_count(paste_short_id text)
    RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
      UPDATE public.pastes
      SET view_count = view_count + 1
      WHERE short_id = paste_short_id;
    END;
    $$;
  `);

  // Remove policies and disable RLS
  pgm.sql('DROP POLICY IF EXISTS "Allow full access to postgres role" ON public.pgmigrations;');
  pgm.sql('ALTER TABLE public.pgmigrations DISABLE ROW LEVEL SECURITY;');
  
  pgm.sql('DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.pastes;');
  pgm.sql('DROP POLICY IF EXISTS "Allow public read access" ON public.pastes;');
  pgm.sql('ALTER TABLE public.pastes DISABLE ROW LEVEL SECURITY;');
}; 