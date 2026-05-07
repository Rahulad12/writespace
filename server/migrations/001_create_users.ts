import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.addExtension('pgcrypto', { ifNotExists: true });

  pgm.createTable('users', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    username: { type: 'varchar(100)', notNull: true, unique: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    bio: { type: 'varchar(500)' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.createIndex('users', ['email'], { unique: true });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('users', { ifExists: true });
  pgm.dropExtension('pgcrypto', { ifExists: true });
};
