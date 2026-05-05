import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createType('blog_status', ['draft', 'published']);

  pgm.createTable('blogs', {
    id: { type: 'serial', primaryKey: true },
    author_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
    title: { type: 'varchar(255)', notNull: true },
    content: { type: 'text', notNull: true },
    status: { type: 'blog_status', notNull: true, default: 'draft' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()') },
    published_at: { type: 'timestamp' },
  });

  pgm.createIndex('blogs', ['author_id']);
  pgm.createIndex('blogs', ['status']);
  pgm.createIndex('blogs', ['created_at']);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('blogs', { ifExists: true });
  pgm.dropType('blog_status', { ifExists: true });
};
