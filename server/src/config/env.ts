import dotenv from 'dotenv';
import { EnvTypes } from '../shared/types/env.types';

dotenv.config();

export const env = {
    port: process.env.PORT!,
    dbUser: process.env.DB_USER!,
    dbHost: process.env.DB_HOST!,
    dbName: process.env.DB_NAME!,
    dbPassword: process.env.DB_PASSWORD!,
    dbPort: process.env.DB_PORT!,
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
} as EnvTypes;
