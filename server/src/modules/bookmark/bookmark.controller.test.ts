import { Request, Response } from "express";
import * as bookmarkService from "./bookmark.service";
import { addBookmark, removeBookmark, getMyBookmarks, checkBookmark } from "./bookmark.controller";

jest.mock("./bookmark.service");

describe("bookmark.controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

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

      await addBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should create bookmark and return 201", async () => {
      const mockBookmark = { id: "1", user_id: "1", blog_id: "5", created_at: new Date() };
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.addBookmark as jest.Mock).mockResolvedValue(mockBookmark);

      await addBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Blog bookmarked successfully",
        bookmark: mockBookmark,
      });
    });

    it("should return 400 when trying to bookmark a draft", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.addBookmark as jest.Mock).mockRejectedValue(
        new Error("Cannot bookmark a draft blog")
      );

      await addBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Cannot bookmark a draft blog" });
    });

    it("should return 404 when blog not found", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "999" } };
      (bookmarkService.addBookmark as jest.Mock).mockRejectedValue(
        new Error("Blog not found")
      );

      await addBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Blog not found" });
    });

    it("should return 409 when bookmark already exists", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.addBookmark as jest.Mock).mockRejectedValue({ code: "23505" });

      await addBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Blog already bookmarked" });
    });
  });

  describe("removeBookmark", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined, params: { blogId: "5" } };

      await removeBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should remove bookmark and return 204", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.removeBookmark as jest.Mock).mockResolvedValue(true);

      await removeBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it("should return 404 when bookmark not found", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "999" } };
      (bookmarkService.removeBookmark as jest.Mock).mockResolvedValue(false);

      await removeBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Bookmark not found" });
    });
  });

  describe("getMyBookmarks", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined };

      await getMyBookmarks(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should return bookmarks with 200", async () => {
      const mockBookmarks = [
        { id: "1", blog_id: "5", title: "Blog 1", author_name: "author1" },
        { id: "2", blog_id: "7", title: "Blog 2", author_name: "author2" },
      ];
      mockReq = { user: { id: "1", name: "test" } };
      (bookmarkService.getMyBookmarks as jest.Mock).mockResolvedValue(mockBookmarks);

      await getMyBookmarks(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ bookmarks: mockBookmarks });
    });
  });

  describe("checkBookmark", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined, params: { blogId: "5" } };

      await checkBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should return bookmarked true", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.isBookmarked as jest.Mock).mockResolvedValue(true);

      await checkBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ bookmarked: true });
    });

    it("should return bookmarked false", async () => {
      mockReq = { user: { id: "1", name: "test" }, params: { blogId: "5" } };
      (bookmarkService.isBookmarked as jest.Mock).mockResolvedValue(false);

      await checkBookmark(mockReq as Request<{ blogId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ bookmarked: false });
    });
  });
});
