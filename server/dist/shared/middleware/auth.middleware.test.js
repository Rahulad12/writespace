"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("./auth.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("../../config/env", () => ({
    env: {
        jwtSecret: "test-secret"
    }
}));
describe("auth.middleware", () => {
    let mockReq;
    let mockRes;
    let nextMock;
    let jsonMock;
    let statusMock;
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
            jsonwebtoken_1.default.verify.mockReturnValue(decodedToken);
            (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, nextMock);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("valid-token", "test-secret");
            expect(mockReq.user).toEqual(decodedToken);
            expect(nextMock).toHaveBeenCalled();
        });
        it("should return 401 when no token is provided", () => {
            mockReq.headers = {};
            (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, nextMock);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
            expect(nextMock).not.toHaveBeenCalled();
        });
        it("should return 401 when token is expired", () => {
            mockReq.headers = { authorization: "Bearer expired-token" };
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new jsonwebtoken_1.default.TokenExpiredError("Token expired", new Date());
            });
            (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, nextMock);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Token expired" });
            expect(nextMock).not.toHaveBeenCalled();
        });
        it("should return 401 when token is invalid", () => {
            mockReq.headers = { authorization: "Bearer invalid-token" };
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });
            (0, auth_middleware_1.authenticateToken)(mockReq, mockRes, nextMock);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid token" });
            expect(nextMock).not.toHaveBeenCalled();
        });
    });
    describe("optionalAuth", () => {
        it("should call next and set req.user when token is valid", () => {
            const decodedToken = { id: 1, username: "testuser" };
            mockReq.headers = { authorization: "Bearer valid-token" };
            jsonwebtoken_1.default.verify.mockReturnValue(decodedToken);
            (0, auth_middleware_1.optionalAuth)(mockReq, mockRes, nextMock);
            expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("valid-token", "test-secret");
            expect(mockReq.user).toEqual(decodedToken);
            expect(nextMock).toHaveBeenCalled();
        });
        it("should call next without user when no token is provided", () => {
            mockReq.headers = {};
            (0, auth_middleware_1.optionalAuth)(mockReq, mockRes, nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });
        it("should call next without user when token is invalid", () => {
            mockReq.headers = { authorization: "Bearer invalid-token" };
            jsonwebtoken_1.default.verify.mockImplementation(() => {
                throw new Error("Invalid token");
            });
            (0, auth_middleware_1.optionalAuth)(mockReq, mockRes, nextMock);
            expect(nextMock).toHaveBeenCalled();
            expect(mockReq.user).toBeUndefined();
        });
    });
});
