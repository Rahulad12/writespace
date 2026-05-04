"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const env_1 = require("./env");
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: env_1.env.dbUser,
    host: env_1.env.dbHost,
    database: env_1.env.dbName,
    password: env_1.env.dbPassword,
    port: Number(env_1.env.dbPort),
});
