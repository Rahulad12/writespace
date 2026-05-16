export interface DecodedUser {
    id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}
