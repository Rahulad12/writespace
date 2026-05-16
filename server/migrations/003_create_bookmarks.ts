import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('bookmarks', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'CASCADE' },
    blog_id: { type: 'uuid', notNull: true, references: 'blogs', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.addConstraint('bookmarks', 'bookmarks_user_id_blog_id_unique', {
    unique: ['user_id', 'blog_id'],
  });

  pgm.createIndex('bookmarks', ['user_id']);
  pgm.createIndex('bookmarks', ['blog_id']);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('bookmarks', { ifExists: true });
};
