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
const followService = __importStar(require("./follow.service"));
const db_1 = require("../../config/db");
jest.mock("../../config/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));
describe("follow.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("followUser", () => {
        it("should follow a user successfully", async () => {
            const mockFollow = {
                id: "1",
                follower_id: "1",
                following_id: "2",
                created_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [{ id: "2" }] })
                .mockResolvedValueOnce({ rows: [mockFollow] });
            const result = await followService.followUser("1", "2");
            expect(db_1.pool.query).toHaveBeenNthCalledWith(1, "SELECT 1 FROM users WHERE id = $1", ["2"]);
            expect(db_1.pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("INSERT INTO follows"), ["1", "2"]);
            expect(result).toEqual(mockFollow);
        });
        it("should throw error when trying to follow yourself", async () => {
            await expect(followService.followUser("1", "1")).rejects.toThrow("Cannot follow yourself");
        });
        it("should throw error when user to follow does not exist", async () => {
            db_1.pool.query.mockResolvedValueOnce({ rows: [] });
            await expect(followService.followUser("1", "999")).rejects.toThrow("User not found");
        });
    });
    describe("unfollowUser", () => {
        it("should remove a follow relationship and return true", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 1 });
            const result = await followService.unfollowUser("1", "2");
            expect(db_1.pool.query).toHaveBeenCalledWith("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", ["1", "2"]);
            expect(result).toBe(true);
        });
        it("should return false when follow relationship not found", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 0 });
            const result = await followService.unfollowUser("1", "999");
            expect(result).toBe(false);
        });
    });
    describe("getFollowers", () => {
        it("should return list of followers with profile info", async () => {
            const mockFollowers = [
                { id: "1", user_id: "3", name: "alice", bio: "Alice bio", created_at: new Date() },
                { id: "2", user_id: "4", name: "bob", bio: null, created_at: new Date() },
            ];
            db_1.pool.query.mockResolvedValue({ rows: mockFollowers });
            const result = await followService.getFollowers("2");
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT f.id, u.id as user_id"), ["2"]);
            expect(result).toEqual(mockFollowers);
        });
        it("should return empty array when no followers", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await followService.getFollowers("1");
            expect(result).toEqual([]);
        });
    });
    describe("getFollowing", () => {
        it("should return list of users being followed", async () => {
            const mockFollowing = [
                { id: "1", user_id: "5", name: "charlie", bio: "Charlie bio", created_at: new Date() },
            ];
            db_1.pool.query.mockResolvedValue({ rows: mockFollowing });
            const result = await followService.getFollowing("1");
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("FROM follows f"), ["1"]);
            expect(result).toEqual(mockFollowing);
        });
        it("should return empty array when not following anyone", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await followService.getFollowing("1");
            expect(result).toEqual([]);
        });
    });
    describe("isFollowing", () => {
        it("should return true when following", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [{ id: "1" }] });
            const result = await followService.isFollowing("1", "2");
            expect(result).toBe(true);
        });
        it("should return false when not following", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await followService.isFollowing("1", "2");
            expect(result).toBe(false);
        });
    });
});
