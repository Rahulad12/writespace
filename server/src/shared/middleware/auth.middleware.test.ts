import { Request, Response, NextFunction } from "express";
import { authenticateToken, optionalAuth } from "./auth.middleware";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("../../config/env", () => ({
    env: {
        jwtSecret: "test-secret"
    }
}));

describe("auth.middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let nextMock: NextFunction;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        nextMock = jest.fn();
        mockReq = {
            headers: {},
            user: undefined
        };
        mockRes = {
            status: statusMock,
            json: jsonMock
        };
        jest.clearAllMocks();
    });

    describe("authenticateToken", () => {
        it("should call next and set req.user when token is valid", () => {
            const decodedToken = { id: 1, username: "testuser" };
            mockReq.headers = { authorization: "Bearer valid-token" };
            (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

            authenticateToken(mockReq as Request, mockRes as Response, nextMock);

            expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
            expect(mockReq.user).toEqual(decodedToken);
            expect(nextMock).toHaveBeenCalled();
        });

        it("should return 401 when no token is provided", () => {
            mockReq.headers = {};

            authenticateToken(mockReq as Request, mockRes as Response, nextMock);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
            expect(nextMock).not.toHaveBeenCalled();
        });

        it("should return 401 when token is expired", () => {
            mockReq.headers = { authorization: "Bearer expired-token" };
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new jwt.TokenExpiredError("Token expired", new Date());
            });

            authenticateToken(mockReq as Request, mockRes as Response, nextMock);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Token expired" });
            expect(nextMock).not.toHaveBeenCalled();
        });

        it("should return 401 when token is invalid", () => {
            mockReq.headers = { authorization: "Bearer invalid-token" };
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            authenticateToken(mockReq as Request, mockRes as Response, nextMock);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid token" });
            expect(nextMock).not.toHaveBeenCalled();
        });
    });

    describe("optionalAuth", () => {
        it("should call next and set req.user when token is valid", () => {
            const decodedToken = { id: 1, username: "testuser" };
            mockReq.headers = { authorization: "Bearer valid-token" };
            (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

            optionalAuth(mockReq as Request, mockRes as Response, nextMock);

            expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
            expect(mockReq.user).toEqual(decodedToken);
            expect(nextMock).toHaveBeenCalled();
        });

        it("should call next without user when no token is provided", () => {
            mockReq.headers = {};

            optionalAuth(mockReq as Request, mockRes as Response, nextMock);

            expect(nextMock).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });

        it("should call next without user when token is invalid", () => {
            mockReq.headers = { authorization: "Bearer invalid-token" };
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("Invalid token");
            });

            optionalAuth(mockReq as Request, mockRes as Response, nextMock);

            expect(nextMock).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });
    });
});
