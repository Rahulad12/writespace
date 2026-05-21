import { Request, Response } from "express";
import * as userService from "./user.service";
import { getUserProfile, getCurrentUserProfile, updateUserProfile } from "./user.controller";
import { UpdateProfileBody } from "./user.types";

jest.mock("./user.service");

describe("user.controller", () => {
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

  describe("getUserProfile", () => {
    it("should return user profile with 200", async () => {
      const mockProfile = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "Test bio",
        created_at: new Date(),
        published_blog_count: 5,
      };
      mockReq = { params: { userId: "1" }, user: undefined };
      (userService.getUserProfile as jest.Mock).mockResolvedValue(mockProfile);

      await getUserProfile(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ profile: mockProfile });
    });

    it("should return 404 when user not found", async () => {
      mockReq = { params: { userId: "999" } };
      (userService.getUserProfile as jest.Mock).mockResolvedValue(null);

      await getUserProfile(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should pass requester id when authenticated", async () => {
      mockReq = { params: { userId: "2" }, user: { id: "1", username: "requester" } };
      (userService.getUserProfile as jest.Mock).mockResolvedValue({ id: "2" });

      await getUserProfile(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(userService.getUserProfile).toHaveBeenCalledWith("2", "1");
    });
  });

  describe("getCurrentUserProfile", () => {
    it("should return 401 when not authenticated", async () => {
      mockReq = { user: undefined };

      await getCurrentUserProfile(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should return current user profile", async () => {
      const mockProfile = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "My bio",
        created_at: new Date(),
        published_blog_count: 3,
      };
      mockReq = { user: { id: "1", username: "testuser" } };
      (userService.getCurrentUserProfile as jest.Mock).mockResolvedValue(mockProfile);

      await getCurrentUserProfile(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ profile: mockProfile });
    });

    it("should return 404 when user not found", async () => {
      mockReq = { user: { id: "999", username: "ghost" } };
      (userService.getCurrentUserProfile as jest.Mock).mockResolvedValue(null);

      await getCurrentUserProfile(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("updateUserProfile", () => {
    it("should return 401 when not authenticated", async () => {
      mockReq = { user: undefined, body: { username: "newname" } };

      await updateUserProfile(mockReq as Request<{}, {}, UpdateProfileBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should update profile and return 200", async () => {
      const mockProfile = {
        id: "1",
        username: "newname",
        email: "test@example.com",
        bio: "New bio",
        created_at: new Date(),
        published_blog_count: 3,
      };
      mockReq = {
        user: { id: "1", username: "testuser" },
        body: { username: "newname", bio: "New bio" },
      };
      (userService.updateUserProfile as jest.Mock).mockResolvedValue({
        success: true,
        profile: mockProfile,
      });

      await updateUserProfile(mockReq as Request<{}, {}, UpdateProfileBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Profile updated successfully",
        profile: mockProfile,
      });
    });

    it("should return 404 when user not found", async () => {
      mockReq = {
        user: { id: "999", username: "ghost" },
        body: { username: "newname" },
      };
      (userService.updateUserProfile as jest.Mock).mockResolvedValue({
        success: false,
        error: "User not found",
      });

      await updateUserProfile(mockReq as Request<{}, {}, UpdateProfileBody>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });
  });
});
