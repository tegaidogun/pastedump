/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql('DROP POLICY IF EXISTS "Allow update for view count" ON public.pastes;');
};

exports.down = (pgm) => {
  pgm.sql(`
    CREATE POLICY "Allow update for view count"
    ON public.pastes
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
  `);
}; 