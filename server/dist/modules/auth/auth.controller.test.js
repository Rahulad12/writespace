"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const auth_controller_1 = require("./auth.controller");
// Mock dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../config/db", () => ({
    pool: {
        query: jest.fn()
    }
}));
jest.mock("../../config/env", () => ({
    env: {
        jwtSecret: "test-secret",
        jwtExpiresIn: "1h"
    }
}));
describe("auth.controller", () => {
    let mockReq;
    let mockRes;
    let jsonMock;
    let statusMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockReq = {
            body: {}
        };
        mockRes = {
            status: statusMock,
            json: jsonMock
        };
        jest.clearAllMocks();
    });
    describe("register", () => {
        it("should create user and return token when credentials are valid", async () => {
            const registerBody = { username: "testuser", email: "test@example.com", password: "password123" };
            mockReq.body = registerBody;
            const mockUserRow = { id: 1, username: "testuser", email: "test@example.com" };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [] }) // No existing user
                .mockResolvedValueOnce({ rows: [mockUserRow] }); // Insert success
            bcryptjs_1.default.hash.mockResolvedValue("hashedPassword");
            jsonwebtoken_1.default.sign.mockReturnValue("mock-token");
            await (0, auth_controller_1.register)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "User created successfully",
                user: { id: 1, username: "testuser", email: "test@example.com" },
                token: "mock-token"
            });
        });
        it("should return 409 when user already exists", async () => {
            const registerBody = { username: "testuser", email: "existing@example.com", password: "password123" };
            mockReq.body = registerBody;
            db_1.pool.query.mockResolvedValue({ rows: [{ id: 1, email: "existing@example.com" }] });
            await (0, auth_controller_1.register)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(409);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" });
        });
        it("should return 500 when database query fails", async () => {
            const registerBody = { username: "testuser", email: "test@example.com", password: "password123" };
            mockReq.body = registerBody;
            db_1.pool.query.mockRejectedValue(new Error("DB error"));
            await (0, auth_controller_1.register)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });
    describe("login", () => {
        it("should return user and token when credentials are valid (email)", async () => {
            const loginBody = { identifier: "test@example.com", password: "password123" };
            mockReq.body = loginBody;
            const mockUserRow = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                password_hash: "hashedPassword"
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockUserRow] });
            bcryptjs_1.default.compare.mockResolvedValue(true);
            jsonwebtoken_1.default.sign.mockReturnValue("mock-token");
            await (0, auth_controller_1.login)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Login successful",
                user: { id: 1, username: "testuser", email: "test@example.com" },
                token: "mock-token"
            });
        });
        it("should return user and token when credentials are valid (username)", async () => {
            const loginBody = { identifier: "testuser", password: "password123" };
            mockReq.body = loginBody;
            const mockUserRow = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                password_hash: "hashedPassword"
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockUserRow] });
            bcryptjs_1.default.compare.mockResolvedValue(true);
            jsonwebtoken_1.default.sign.mockReturnValue("mock-token");
            await (0, auth_controller_1.login)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Login successful",
                user: { id: 1, username: "testuser", email: "test@example.com" },
                token: "mock-token"
            });
        });
        it("should return 401 when user does not exist", async () => {
            const loginBody = { identifier: "nonexistent@example.com", password: "password123" };
            mockReq.body = loginBody;
            db_1.pool.query.mockResolvedValue({ rows: [] });
            await (0, auth_controller_1.login)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });
        it("should return 401 when password is invalid", async () => {
            const loginBody = { identifier: "test@example.com", password: "wrongpassword" };
            mockReq.body = loginBody;
            const mockUserRow = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                password_hash: "hashedPassword"
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockUserRow] });
            bcryptjs_1.default.compare.mockResolvedValue(false);
            await (0, auth_controller_1.login)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });
        it("should return 500 when database query fails", async () => {
            const loginBody = { identifier: "test@example.com", password: "password123" };
            mockReq.body = loginBody;
            db_1.pool.query.mockRejectedValue(new Error("DB error"));
            await (0, auth_controller_1.login)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });
});
