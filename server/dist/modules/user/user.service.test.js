"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const userService = __importStar(require("./user.service"));
const db_1 = require("../../config/db");
jest.mock("../../config/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));
describe("user.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getUserProfile", () => {
        it("should return user profile with published blog count", async () => {
            const mockUser = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "Test bio",
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "5" }] });
            const result = await userService.getUserProfile("1");
            expect(result).not.toBeNull();
            expect(result).toHaveProperty("published_blog_count", 5);
            expect(result).toHaveProperty("name", "testuser");
        });
        it("should return null when user not found", async () => {
            db_1.pool.query.mockResolvedValueOnce({ rows: [] });
            const result = await userService.getUserProfile("999");
            expect(result).toBeNull();
        });
        it("should include is_following when requester is different user", async () => {
            const mockUser = {
                id: "2",
                name: "other",
                email: "other@example.com",
                bio: null,
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "0" }] })
                .mockResolvedValueOnce({ rows: [{ id: "1" }] });
            const result = await userService.getUserProfile("2", "1");
            expect(result).not.toBeNull();
            expect(result).toHaveProperty("is_following", true);
        });
        it("should not include is_following when viewing own profile", async () => {
            const mockUser = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "My bio",
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "3" }] });
            const result = await userService.getUserProfile("1", "1");
            expect(result).not.toBeNull();
            expect(result).not.toHaveProperty("is_following");
        });
    });
    describe("getCurrentUserProfile", () => {
        it("should return current user profile", async () => {
            const mockUser = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "My bio",
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "2" }] });
            const result = await userService.getCurrentUserProfile("1");
            expect(result).not.toBeNull();
            expect(result).toHaveProperty("name", "testuser");
            expect(result).toHaveProperty("published_blog_count", 2);
        });
        it("should return null when user not found", async () => {
            db_1.pool.query.mockResolvedValueOnce({ rows: [] });
            const result = await userService.getCurrentUserProfile("999");
            expect(result).toBeNull();
        });
    });
    describe("updateUserProfile", () => {
        it("should update name and bio", async () => {
            const mockUser = {
                id: "1",
                name: "newname",
                email: "test@example.com",
                bio: "New bio",
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "1" }] });
            const updateData = {
                name: "newname",
                bio: "New bio",
            };
            const result = await userService.updateUserProfile("1", updateData);
            expect(result.success).toBe(true);
            expect(result.profile).toHaveProperty("name", "newname");
            expect(result.profile).toHaveProperty("bio", "New bio");
        });
        it("should return current profile when no updates provided", async () => {
            const mockUser = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "Bio",
                created_at: new Date(),
                updated_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [mockUser] })
                .mockResolvedValueOnce({ rows: [{ count: "0" }] });
            const result = await userService.updateUserProfile("1", {});
            expect(result.success).toBe(true);
            expect(result.profile).toHaveProperty("name", "testuser");
        });
    });
});
