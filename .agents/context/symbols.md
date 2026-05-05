# symbols.md
# Generated: 2026-05-05 14:42:29 UTC

server/src/app.ts:29:export default app;
server/src/config/db.ts:4:export const pool = new Pool({
server/src/config/env.ts:6:export const env = {
server/src/modules/auth/auth.controller.ts:16:export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
server/src/modules/auth/auth.controller.ts:45:export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
server/src/modules/auth/auth.routes.ts:10:export default authRouter;
server/src/modules/auth/auth.types.ts:4:export type RegisterBody = z.infer<typeof registerSchema>;
server/src/modules/auth/auth.types.ts:5:export type LoginBody = z.infer<typeof loginSchema>;
server/src/modules/auth/auth.types.ts:7:export interface UserRow {
server/src/modules/auth/auth.validation.schema.ts:3:export const registerSchema = z.object({
server/src/modules/auth/auth.validation.schema.ts:9:export const loginSchema = z.object({
server/src/shared/middleware/auth.middleware.ts:25:export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
server/src/shared/middleware/auth.middleware.ts:5:export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
server/src/shared/middleware/validator.ts:4:export const validate = (schema: ZodSchema) => {
server/src/shared/types/env.types.ts:12:export interface GithubSettings {
server/src/shared/types/env.types.ts:17:export interface AppSettings {
server/src/shared/types/env.types.ts:1:export interface EnvTypes {
server/src/shared/types/express.d.ts:1:export interface DecodedUser {
