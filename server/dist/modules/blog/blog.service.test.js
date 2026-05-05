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
const blogService = __importStar(require("./blog.service"));
const db_1 = require("../../config/db");
jest.mock("../../config/db", () => ({
    pool: {
        query: jest.fn(),
    },
}));
describe("blog.service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createBlog", () => {
        it("should create a draft blog without published_at", async () => {
            const blogData = {
                title: "Test Blog",
                content: "Test Content",
                status: "draft",
            };
            const mockBlog = {
                id: 1,
                author_id: 1,
                title: "Test Blog",
                content: "Test Content",
                status: "draft",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: null,
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockBlog] });
            const result = await blogService.createBlog(1, blogData);
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO blogs"), [1, "Test Blog", "Test Content", "draft", null]);
            expect(result).toEqual(mockBlog);
        });
        it("should create a published blog with published_at set", async () => {
            const blogData = {
                title: "Published Blog",
                content: "Published Content",
                status: "published",
            };
            const mockBlog = {
                id: 2,
                author_id: 1,
                title: "Published Blog",
                content: "Published Content",
                status: "published",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: new Date(),
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockBlog] });
            await blogService.createBlog(1, blogData);
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO blogs"), [1, "Published Blog", "Published Content", "published", "NOW()"]);
        });
    });
    describe("getBlogById", () => {
        it("should return blog with author when found", async () => {
            const mockBlog = {
                id: 1,
                author_id: 1,
                title: "Test Blog",
                content: "Test Content",
                status: "published",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: new Date(),
                author_username: "testuser",
                author_email: "test@example.com",
            };
            db_1.pool.query.mockResolvedValue({ rows: [mockBlog] });
            const result = await blogService.getBlogById(1);
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT b.*, u.username"), [1]);
            expect(result).toEqual(mockBlog);
        });
        it("should return null when blog not found", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await blogService.getBlogById(999);
            expect(result).toBeNull();
        });
    });
    describe("getBlogs", () => {
        it("should return only published blogs by default", async () => {
            const mockBlogs = [
                { id: 1, title: "Blog 1", status: "published" },
                { id: 2, title: "Blog 2", status: "published" },
            ];
            db_1.pool.query.mockResolvedValue({ rows: mockBlogs });
            const result = await blogService.getBlogs();
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("AND b.status = 'published'"), expect.arrayContaining([10, 0]));
            expect(result).toEqual(mockBlogs);
        });
        it("should filter by authorId and status", async () => {
            const mockBlogs = [{ id: 1, title: "Blog 1" }];
            db_1.pool.query.mockResolvedValue({ rows: mockBlogs });
            await blogService.getBlogs({ authorId: 1, status: "published" });
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("AND b.author_id = $1"), expect.arrayContaining([1, "published"]));
        });
        it("should allow fetching drafts when explicitly requested", async () => {
            const mockBlogs = [{ id: 1, title: "Draft Blog", status: "draft" }];
            db_1.pool.query.mockResolvedValue({ rows: mockBlogs });
            await blogService.getBlogs({ status: "draft" });
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("AND b.status = $1"), expect.arrayContaining(["draft"]));
        });
    });
    describe("getMyDrafts", () => {
        it("should return only drafts for the specified author", async () => {
            const mockDrafts = [
                { id: 1, title: "Draft 1", status: "draft", author_id: 1 },
                { id: 2, title: "Draft 2", status: "draft", author_id: 1 },
            ];
            db_1.pool.query.mockResolvedValue({ rows: mockDrafts });
            const result = await blogService.getMyDrafts(1);
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM blogs"), [1]);
            expect(result).toEqual(mockDrafts);
            expect(result.every((blog) => blog.status === "draft")).toBe(true);
        });
        it("should return empty array when no drafts exist", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await blogService.getMyDrafts(1);
            expect(result).toEqual([]);
        });
    });
    describe("publishDraft", () => {
        it("should publish a draft and set published_at", async () => {
            const draftBlog = {
                id: 1,
                author_id: 1,
                title: "Draft",
                content: "Content",
                status: "draft",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: null,
            };
            const publishedBlog = { ...draftBlog, status: "published", published_at: new Date() };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [draftBlog] })
                .mockResolvedValueOnce({ rows: [publishedBlog] });
            const result = await blogService.publishDraft(1, 1);
            expect(result?.status).toBe("published");
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE blogs"), [1, 1]);
        });
        it("should return null when draft not found or unauthorized", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await blogService.publishDraft(999, 1);
            expect(result).toBeNull();
        });
        it("should not publish someone else's draft", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await blogService.publishDraft(1, 2); // Different user
            expect(result).toBeNull();
        });
    });
    describe("updateBlog", () => {
        it("should update blog and return updated blog", async () => {
            const existingBlog = {
                id: 1,
                author_id: 1,
                title: "Old Title",
                content: "Old Content",
                status: "draft",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: null,
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [existingBlog] })
                .mockResolvedValueOnce({
                rows: [{ ...existingBlog, title: "New Title" }],
            });
            const updateData = { title: "New Title" };
            const result = await blogService.updateBlog(1, 1, updateData);
            expect(result).toBeDefined();
            expect(result?.title).toBe("New Title");
        });
        it("should return null when blog not found or unauthorized", async () => {
            db_1.pool.query.mockResolvedValue({ rows: [] });
            const result = await blogService.updateBlog(999, 1, { title: "New" });
            expect(result).toBeNull();
        });
        it("should set published_at when status changes to published", async () => {
            const draftBlog = {
                id: 1,
                author_id: 1,
                title: "Draft",
                content: "Content",
                status: "draft",
                created_at: new Date(),
                updated_at: new Date(),
                published_at: null,
            };
            db_1.pool.query
                .mockResolvedValueOnce({ rows: [draftBlog] })
                .mockResolvedValueOnce({ rows: [{ ...draftBlog, status: "published" }] });
            await blogService.updateBlog(1, 1, { status: "published" });
            expect(db_1.pool.query).toHaveBeenCalledWith(expect.stringContaining("published_at = NOW()"), expect.any(Array));
        });
    });
    describe("deleteBlog", () => {
        it("should return true when blog deleted", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 1 });
            const result = await blogService.deleteBlog(1, 1);
            expect(result).toBe(true);
        });
        it("should return false when blog not found or unauthorized", async () => {
            db_1.pool.query.mockResolvedValue({ rowCount: 0 });
            const result = await blogService.deleteBlog(999, 1);
            expect(result).toBe(false);
        });
    });
});
