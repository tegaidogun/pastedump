/* eslint-disable @typescript-eslint/naming-convention */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('pastes', {
    id: 'id',
    short_id: { type: 'text', notNull: true, unique: true },
    title: { type: 'text' },
    content: { type: 'text', notNull: true },
    language: { type: 'text', notNull: true },
    author: { type: 'text' },
    expiration: { type: 'timestamptz', notNull: true },
    view_count: { type: 'integer', default: 0 },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.createFunction(
    'increment_view_count',
    [{ name: 'paste_short_id', type: 'text' }],
    {
      returns: 'void',
      language: 'plpgsql',
      body: `
BEGIN
  UPDATE pastes
  SET view_count = view_count + 1
  WHERE short_id = paste_short_id;
END;
      `,
    }
  );

  pgm.sql(`
    ALTER TABLE pastes
    ADD COLUMN fts tsvector
    GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content)) STORED;
  `);
  
  pgm.createIndex('pastes', 'fts', { method: 'gin' });
};

exports.down = (pgm) => {
  pgm.dropTable('pastes');
  pgm.dropFunction('increment_view_count', [{ name: 'paste_short_id', type: 'text' }]);
}; 