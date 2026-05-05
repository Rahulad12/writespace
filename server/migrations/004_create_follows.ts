import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('follows', {
    id: { type: 'serial', primaryKey: true },
    follower_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
    following_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.addConstraint('follows', 'follows_follower_id_following_id_unique', {
    unique: ['follower_id', 'following_id'],
  });

  pgm.addConstraint('follows', 'follows_no_self_follow', {
    check: 'follower_id <> following_id',
  });

  pgm.createIndex('follows', ['follower_id']);
  pgm.createIndex('follows', ['following_id']);
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('follows', { ifExists: true });
};
