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
const bookmark_controller_1 = require("./bookmark.controller");
jest.mock("./bookmark.service");
describe("bookmark.controller", () => {
    let mockReq;
    let mockRes;
    let jsonMock;
    let statusMock;
    let sendMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        sendMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock, send: sendMock });
        mockRes = {
            status: statusMock,
            json: jsonMock,
            send: sendMock,
        };
        jest.clearAllMocks();
    });
    describe("addBookmark", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { blogId: "5" } };
            await (0, bookmark_controller_1.addBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should create bookmark and return 201", async () => {
            const mockBookmark = { id: "1", user_id: "1", blog_id: "5", created_at: new Date() };
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.addBookmark.mockResolvedValue(mockBookmark);
            await (0, bookmark_controller_1.addBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Blog bookmarked successfully",
                bookmark: mockBookmark,
            });
        });
        it("should return 400 when trying to bookmark a draft", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.addBookmark.mockRejectedValue(new Error("Cannot bookmark a draft blog"));
            await (0, bookmark_controller_1.addBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Cannot bookmark a draft blog" });
        });
        it("should return 404 when blog not found", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "999" } };
            bookmarkService.addBookmark.mockRejectedValue(new Error("Blog not found"));
            await (0, bookmark_controller_1.addBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Blog not found" });
        });
        it("should return 409 when bookmark already exists", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.addBookmark.mockRejectedValue({ code: "23505" });
            await (0, bookmark_controller_1.addBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(409);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Blog already bookmarked" });
        });
    });
    describe("removeBookmark", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { blogId: "5" } };
            await (0, bookmark_controller_1.removeBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should remove bookmark and return 204", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.removeBookmark.mockResolvedValue(true);
            await (0, bookmark_controller_1.removeBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });
        it("should return 404 when bookmark not found", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "999" } };
            bookmarkService.removeBookmark.mockResolvedValue(false);
            await (0, bookmark_controller_1.removeBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Bookmark not found" });
        });
    });
    describe("getMyBookmarks", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined };
            await (0, bookmark_controller_1.getMyBookmarks)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should return bookmarks with 200", async () => {
            const mockBookmarks = [
                { id: "1", blog_id: "5", title: "Blog 1", author_name: "author1" },
                { id: "2", blog_id: "7", title: "Blog 2", author_name: "author2" },
            ];
            mockReq = { user: { id: "1", name: "test" } };
            bookmarkService.getMyBookmarks.mockResolvedValue(mockBookmarks);
            await (0, bookmark_controller_1.getMyBookmarks)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ bookmarks: mockBookmarks });
        });
    });
    describe("checkBookmark", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { blogId: "5" } };
            await (0, bookmark_controller_1.checkBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should return bookmarked true", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.isBookmarked.mockResolvedValue(true);
            await (0, bookmark_controller_1.checkBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ bookmarked: true });
        });
        it("should return bookmarked false", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
            bookmarkService.isBookmarked.mockResolvedValue(false);
            await (0, bookmark_controller_1.checkBookmark)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ bookmarked: false });
        });
    });
});
