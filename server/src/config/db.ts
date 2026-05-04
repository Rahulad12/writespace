import { env } from "./env";
import { Pool } from "pg";

export const pool = new Pool({
  user: env.dbUser,
  host: env.dbHost,
  database: env.dbName,
  password: env.dbPassword,
  port: Number(env.dbPort),
});