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
const blog_controller_1 = require("./blog.controller");
jest.mock("./blog.service");
describe("blog.controller", () => {
    let mockReq;
    let mockRes;
    let jsonMock;
    let statusMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRes = {
            status: statusMock,
            json: jsonMock,
        };
        jest.clearAllMocks();
    });
    describe("createBlog", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = {
                user: undefined,
                body: { title: "Test", content: "Content", status: "draft" },
            };
            await (0, blog_controller_1.createBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should create blog and return 201", async () => {
            const mockBlog = {
                id: 1,
                author_id: 1,
                title: "Test",
                content: "Content",
                status: "draft",
            };
            mockReq = {
                user: { id: 1, username: "test" },
                body: { title: "Test", content: "Content", status: "draft" },
            };
            blogService.createBlog.mockResolvedValue(mockBlog);
            await (0, blog_controller_1.createBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Blog created successfully",
                blog: mockBlog,
            });
        });
        it("should return 500 on service error", async () => {
            mockReq = {
                user: { id: 1, username: "test" },
                body: { title: "Test", content: "Content" },
            };
            blogService.createBlog.mockRejectedValue(new Error("DB error"));
            await (0, blog_controller_1.createBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(500);
        });
    });
    describe("getBlogs", () => {
        it("should return blogs with 200", async () => {
            const mockBlogs = [{ id: 1, title: "Blog 1" }];
            mockReq = { query: {} };
            blogService.getBlogs.mockResolvedValue(mockBlogs);
            await (0, blog_controller_1.getBlogs)(mockReq, mockRes);
            expect(jsonMock).toHaveBeenCalledWith({ blogs: mockBlogs });
        });
        it("should pass query params to service", async () => {
            mockReq = { query: { authorId: "1", status: "published", limit: "5" } };
            blogService.getBlogs.mockResolvedValue([]);
            await (0, blog_controller_1.getBlogs)(mockReq, mockRes);
            expect(blogService.getBlogs).toHaveBeenCalledWith({
                authorId: 1,
                status: "published",
                limit: 5,
                offset: undefined,
            });
        });
    });
    describe("getMyDrafts", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = { user: undefined };
            await (0, blog_controller_1.getMyDrafts)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should return drafts with 200", async () => {
            const mockDrafts = [
                { id: 1, title: "Draft 1", status: "draft" },
                { id: 2, title: "Draft 2", status: "draft" },
            ];
            mockReq = { user: { id: 1, username: "test" } };
            blogService.getMyDrafts.mockResolvedValue(mockDrafts);
            await (0, blog_controller_1.getMyDrafts)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ drafts: mockDrafts });
        });
    });
    describe("getBlogById", () => {
        it("should return 404 when blog not found", async () => {
            mockReq = { params: { id: "999" }, user: { id: 1, username: "test" } };
            blogService.getBlogById.mockResolvedValue(null);
            await (0, blog_controller_1.getBlogById)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it("should return 404 when trying to view another user's draft", async () => {
            const draftBlog = {
                id: 1,
                title: "Draft",
                status: "draft",
                author_id: 1,
            };
            mockReq = { params: { id: "1" }, user: { id: 2, username: "other" } }; // Different user
            blogService.getBlogById.mockResolvedValue(draftBlog);
            await (0, blog_controller_1.getBlogById)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it("should return blog when found and authorized", async () => {
            const mockBlog = { id: 1, title: "Test Blog", status: "published" };
            mockReq = { params: { id: "1" }, user: { id: 1, username: "test" } };
            blogService.getBlogById.mockResolvedValue(mockBlog);
            await (0, blog_controller_1.getBlogById)(mockReq, mockRes);
            expect(jsonMock).toHaveBeenCalledWith({ blog: mockBlog });
        });
        it("should allow author to view their own draft", async () => {
            const draftBlog = {
                id: 1,
                title: "My Draft",
                status: "draft",
                author_id: 1,
            };
            mockReq = { params: { id: "1" }, user: { id: 1, username: "test" } };
            blogService.getBlogById.mockResolvedValue(draftBlog);
            await (0, blog_controller_1.getBlogById)(mockReq, mockRes);
            expect(jsonMock).toHaveBeenCalledWith({ blog: draftBlog });
        });
    });
    describe("publishDraft", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = { user: undefined, params: { id: "1" } };
            await (0, blog_controller_1.publishDraft)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
        });
        it("should return 404 when draft not found", async () => {
            mockReq = { user: { id: 1, username: "test" }, params: { id: "999" } };
            blogService.publishDraft.mockResolvedValue(null);
            await (0, blog_controller_1.publishDraft)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it("should publish draft and return 200", async () => {
            const publishedBlog = {
                id: 1,
                title: "Published",
                status: "published",
            };
            mockReq = { user: { id: 1, username: "test" }, params: { id: "1" } };
            blogService.publishDraft.mockResolvedValue(publishedBlog);
            await (0, blog_controller_1.publishDraft)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Blog published successfully",
                blog: publishedBlog,
            });
        });
    });
    describe("updateBlog", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = {
                user: undefined,
                params: { id: "1" },
                body: { title: "Updated" },
            };
            await (0, blog_controller_1.updateBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
        });
        it("should return 404 when blog not found", async () => {
            mockReq = {
                user: { id: 1, username: "test" },
                params: { id: "999" },
                body: { title: "Updated" },
            };
            blogService.updateBlog.mockResolvedValue(null);
            await (0, blog_controller_1.updateBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it("should update and return blog", async () => {
            const updatedBlog = { id: 1, title: "Updated" };
            mockReq = {
                user: { id: 1, username: "test" },
                params: { id: "1" },
                body: { title: "Updated" },
            };
            blogService.updateBlog.mockResolvedValue(updatedBlog);
            await (0, blog_controller_1.updateBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Blog updated successfully",
                blog: updatedBlog,
            });
        });
    });
    describe("deleteBlog", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = { user: undefined, params: { id: "1" } };
            await (0, blog_controller_1.deleteBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
        });
        it("should return 404 when blog not found", async () => {
            mockReq = { user: { id: 1, username: "test" }, params: { id: "999" } };
            blogService.deleteBlog.mockResolvedValue(false);
            await (0, blog_controller_1.deleteBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
        });
        it("should delete and return success", async () => {
            mockReq = { user: { id: 1, username: "test" }, params: { id: "1" } };
            blogService.deleteBlog.mockResolvedValue(true);
            await (0, blog_controller_1.deleteBlog)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Blog deleted successfully" });
        });
    });
});
