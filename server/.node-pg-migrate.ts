import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env') });

module.exports = {
  migrationsDir: 'migrations',
  migrationsTable: 'pgmigrations',
  direction: 'up',
  dbUrl: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  migrationsSchema: 'public',
  createMigrationsDir: true,
  ignorePattern: '.*\\.js$',
  fileExtension: 'ts',
  tsconfig: './tsconfig.json',
};
