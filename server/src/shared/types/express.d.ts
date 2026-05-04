export interface DecodedUser {
    id: number;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}
