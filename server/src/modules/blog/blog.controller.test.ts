import { Request, Response } from "express";
import * as blogService from "./blog.service";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "./blog.controller";
import { CreateBlogBody, UpdateBlogBody } from "./blog.types";

jest.mock("./blog.service");

describe("blog.controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

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

      await createBlog(mockReq as Request<{}, {}, CreateBlogBody>, mockRes as Response);

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
      (blogService.createBlog as jest.Mock).mockResolvedValue(mockBlog);

      await createBlog(mockReq as Request<{}, {}, CreateBlogBody>, mockRes as Response);

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
      (blogService.createBlog as jest.Mock).mockRejectedValue(new Error("DB error"));

      await createBlog(mockReq as Request<{}, {}, CreateBlogBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });

  describe("getBlogs", () => {
    it("should return blogs with 200", async () => {
      const mockBlogs = [{ id: 1, title: "Blog 1" }];
      mockReq = { query: {} };
      (blogService.getBlogs as jest.Mock).mockResolvedValue(mockBlogs);

      await getBlogs(mockReq as Request, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ blogs: mockBlogs });
    });

    it("should pass query params to service", async () => {
      mockReq = { query: { authorId: "1", status: "published", limit: "5" } };
      (blogService.getBlogs as jest.Mock).mockResolvedValue([]);

      await getBlogs(mockReq as Request, mockRes as Response);

      expect(blogService.getBlogs).toHaveBeenCalledWith({
        authorId: 1,
        status: "published",
        limit: 5,
        offset: undefined,
      });
    });
  });

  describe("getBlogById", () => {
    it("should return 404 when blog not found", async () => {
      mockReq = { params: { id: "999" } };
      (blogService.getBlogById as jest.Mock).mockResolvedValue(null);

      await getBlogById(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it("should return blog when found", async () => {
      const mockBlog = { id: 1, title: "Test Blog" };
      mockReq = { params: { id: "1" } };
      (blogService.getBlogById as jest.Mock).mockResolvedValue(mockBlog);

      await getBlogById(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(jsonMock).toHaveBeenCalledWith({ blog: mockBlog });
    });
  });

  describe("updateBlog", () => {
    it("should return 401 when not authenticated", async () => {
      mockReq = {
        user: undefined,
        params: { id: "1" },
        body: { title: "Updated" },
      };

      await updateBlog(mockReq as Request<{ id: string }, {}, UpdateBlogBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it("should return 404 when blog not found", async () => {
      mockReq = {
        user: { id: 1, username: "test" },
        params: { id: "999" },
        body: { title: "Updated" },
      };
      (blogService.updateBlog as jest.Mock).mockResolvedValue(null);

      await updateBlog(mockReq as Request<{ id: string }, {}, UpdateBlogBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it("should update and return blog", async () => {
      const updatedBlog = { id: 1, title: "Updated" };
      mockReq = {
        user: { id: 1, username: "test" },
        params: { id: "1" },
        body: { title: "Updated" },
      };
      (blogService.updateBlog as jest.Mock).mockResolvedValue(updatedBlog);

      await updateBlog(mockReq as Request<{ id: string }, {}, UpdateBlogBody>, mockRes as Response);

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

      await deleteBlog(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it("should return 404 when blog not found", async () => {
      mockReq = { user: { id: 1, username: "test" }, params: { id: "999" } };
      (blogService.deleteBlog as jest.Mock).mockResolvedValue(false);

      await deleteBlog(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it("should delete and return success", async () => {
      mockReq = { user: { id: 1, username: "test" }, params: { id: "1" } };
      (blogService.deleteBlog as jest.Mock).mockResolvedValue(true);

      await deleteBlog(mockReq as Request<{ id: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Blog deleted successfully" });
    });
  });
});
