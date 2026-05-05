import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder): void => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(50)', notNull: true, unique: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    bio: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('NOW()') },
    updated_at: { type: 'timestamp', default: pgm.func('NOW()') },
  });

  pgm.createIndex('users', ['email'], { unique: true });
  pgm.createIndex('users', ['username'], { unique: true });
};

export const down = (pgm: MigrationBuilder): void => {
  pgm.dropTable('users', { ifExists: true });
};
