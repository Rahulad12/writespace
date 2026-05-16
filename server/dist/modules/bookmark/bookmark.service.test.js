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
const bookmarkService = __importStar(require("./bookmark.service"));
const db_1 = require("../../config/db");
jest.mock("../../config/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));
describe("bookmark.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("addBookmark", () => {
        it("should add a bookmark for a published blog", async () => {
            const mockBookmark = {
                id: "1",
                user_id: "1",
                blog_id: "5",
                created_at: new Date(),
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [{ status: "published" }] })
                .mockResolvedValueOnce({ rows: [mockBookmark] });
            const result = await bookmarkService.addBookmark("1", "5");
            expect(db_1.pool.query).toHaveBeenNthCalledWith(1, "SELECT status FROM blogs WHERE id = $1", ["5"]);
            expect(db_1.pool.query).toHaveBeenNthCalledWith(2, expect.stringContaining("INSERT INTO bookmarks"), ["1", "5"]);
            expect(result).toEqual(mockBookmark);
        });
        it("should throw error when trying to bookmark a draft", async () => {
            db_1.pool.query.mockResolvedValueOnce({ rows: [{ status: "draft" }] });
            await expect(bookmarkService.addBookmark("1", "5")).rejects.toThrow("Cannot bookmark a draft blog");
        });
        it("should throw error when blog not found", async () => {
            db_1.pool.query.mockResolvedValueOnce({ rows: [] });
            await expect(bookmarkService.addBookmark("1", "999")).rejects.toThrow("Blog not found");
        });
    });
    describe("removeBookmark", () => {
        it("should remove a bookmark and return true", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 1 });
            const result = await bookmarkService.removeBookmark("1", "5");
            expect(db_1.pool.query).toHaveBeenCalledWith("DELETE FROM bookmarks WHERE user_id = $1 AND blog_id = $2", ["1", "5"]);
            expect(result).toBe(true);
        });
        it("should return false when bookmark not found", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 0 });
            const result = await bookmarkService.removeBookmark("1", "999");
            expect(result).toBe(false);
        });
    });
    describe("getMyBookmarks", () => {
        it("should return bookmarked blogs with details", async () => {
            const mockBookmarks = [
                {
                    id: "1",
                    user_id: "1",
                    blog_id: "5",
                    created_at: new Date(),
                    title: "Blog 1",
                    content: "Content 1",
                    status: "published",
                    author_name: "author1",
                    author_email: "author1@example.com",
                    published_at: new Date(),
                },
                {
                    id: "2",
                    user_id: "1",
                    blog_id: "7",
                    created_at: new Date(),
                    title: "Blog 2",
                    content: "Content 2",
                    status: "published",
                    author_name: "author2",
                    author_email: "author2@example.com",
                    published_at: new Date(),
                },
            ];
            db_1.pool.query.mockResolvedValue({ rows: mockBookmarks });
            const result = await bookmarkService.getMyBookmarks("1");
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT b.id, b.user_id, b.blog_id"), ["1"]);
            expect(result).toEqual(mockBookmarks);
            expect(result).toHaveLength(2);
        });
        it("should return empty array when no bookmarks exist", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await bookmarkService.getMyBookmarks("1");
            expect(result).toEqual([]);
        });
    });
    describe("isBookmarked", () => {
        it("should return true when blog is bookmarked", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [{ id: "1" }] });
            const result = await bookmarkService.isBookmarked("1", "5");
            expect(db_1.pool.query).toHaveBeenCalledWith("SELECT 1 FROM bookmarks WHERE user_id = $1 AND blog_id = $2", ["1", "5"]);
            expect(result).toBe(true);
        });
        it("should return false when blog is not bookmarked", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await bookmarkService.isBookmarked("1", "999");
            expect(result).toBe(false);
        });
    });
});
