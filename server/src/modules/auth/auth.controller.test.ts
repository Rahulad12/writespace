import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import { login, register } from "./auth.controller";

// Mock dependencies
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../server/src/config/db", () => ({
    pool: {
        query: jest.fn()
    }
}));
jest.mock("../../../server/src/config/env", () => ({
    env: {
        jwtSecret: "test-secret",
        jwtExpiresIn: "1h"
    }
}));

describe("auth.controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

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
            (pool.query as jest.Mock)
                .mockResolvedValueOnce({ rows: [] }) // No existing user
                .mockResolvedValueOnce({ rows: [mockUserRow] }); // Insert success
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
            (jwt.sign as jest.Mock).mockReturnValue("mock-token");

            await register(mockReq as Request, mockRes as Response);

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

            (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1, email: "existing@example.com" }] });

            await register(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(409);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User already exists" });
        });

        it("should return 500 when database query fails", async () => {
            const registerBody = { username: "testuser", email: "test@example.com", password: "password123" };
            mockReq.body = registerBody;

            (pool.query as jest.Mock).mockRejectedValue(new Error("DB error"));

            await register(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });

    describe("login", () => {
        it("should return user and token when credentials are valid", async () => {
            const loginBody = { email: "test@example.com", password: "password123" };
            mockReq.body = loginBody;

            const mockUserRow = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                password: "hashedPassword"
            };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUserRow] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("mock-token");

            await login(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Login successful",
                user: { id: 1, username: "testuser", email: "test@example.com" },
                token: "mock-token"
            });
        });

        it("should return 401 when user does not exist", async () => {
            const loginBody = { email: "nonexistent@example.com", password: "password123" };
            mockReq.body = loginBody;

            (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

            await login(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });

        it("should return 401 when password is invalid", async () => {
            const loginBody = { email: "test@example.com", password: "wrongpassword" };
            mockReq.body = loginBody;

            const mockUserRow = {
                id: 1,
                username: "testuser",
                email: "test@example.com",
                password: "hashedPassword"
            };
            (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUserRow] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await login(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });

        it("should return 500 when database query fails", async () => {
            const loginBody = { email: "test@example.com", password: "password123" };
            mockReq.body = loginBody;

            (pool.query as jest.Mock).mockRejectedValue(new Error("DB error"));

            await login(mockReq as Request, mockRes as Response);

            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
        });
    });
});
