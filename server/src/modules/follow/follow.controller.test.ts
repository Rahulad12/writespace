import { Request, Response } from "express";
import * as followService from "./follow.service";
import { followUser, unfollowUser, getFollowers, getFollowing, getFollowStatus } from "./follow.controller";

jest.mock("./follow.service");

describe("follow.controller", () => {
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

  describe("followUser", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined, params: { userId: "2" } };

      await followUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should follow user and return 201", async () => {
      const mockFollow = { id: "1", follower_id: "1", following_id: "2", created_at: new Date() };
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "2" } };
      (followService.followUser as jest.Mock).mockResolvedValue(mockFollow);

      await followUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "User followed successfully",
        follow: mockFollow,
      });
    });

    it("should return 400 when trying to follow yourself", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "1" } };
      (followService.followUser as jest.Mock).mockRejectedValue(
        new Error("Cannot follow yourself")
      );

      await followUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Cannot follow yourself" });
    });

    it("should return 404 when user to follow not found", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "999" } };
      (followService.followUser as jest.Mock).mockRejectedValue(
        new Error("User not found")
      );

      await followUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 409 when already following", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "2" } };
      (followService.followUser as jest.Mock).mockRejectedValue({ code: "23505" });

      await followUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Already following this user" });
    });
  });

  describe("unfollowUser", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined, params: { userId: "2" } };

      await unfollowUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should unfollow user and return 204", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "2" } };
      (followService.unfollowUser as jest.Mock).mockResolvedValue(true);

      await unfollowUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalled();
    });

    it("should return 404 when follow relationship not found", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "999" } };
      (followService.unfollowUser as jest.Mock).mockResolvedValue(false);

      await unfollowUser(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Follow relationship not found" });
    });
  });

  describe("getFollowers", () => {
    it("should return followers with 200", async () => {
      const mockFollowers = [
        { id: "1", user_id: "3", username: "alice", bio: "Alice bio" },
      ];
      mockReq = { params: { userId: "2" } };
      (followService.getFollowers as jest.Mock).mockResolvedValue(mockFollowers);

      await getFollowers(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ followers: mockFollowers });
    });

    it("should return empty followers list", async () => {
      mockReq = { params: { userId: "1" } };
      (followService.getFollowers as jest.Mock).mockResolvedValue([]);

      await getFollowers(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ followers: [] });
    });
  });

  describe("getFollowing", () => {
    it("should return following list with 200", async () => {
      const mockFollowing = [
        { id: "1", user_id: "5", username: "charlie", bio: "Charlie bio" },
        { id: "2", user_id: "6", username: "diana", bio: null },
      ];
      mockReq = { params: { userId: "1" } };
      (followService.getFollowing as jest.Mock).mockResolvedValue(mockFollowing);

      await getFollowing(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ following: mockFollowing });
    });

    it("should return empty following list", async () => {
      mockReq = { params: { userId: "1" } };
      (followService.getFollowing as jest.Mock).mockResolvedValue([]);

      await getFollowing(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ following: [] });
    });
  });

  describe("getFollowStatus", () => {
    it("should return 401 when user not authenticated", async () => {
      mockReq = { user: undefined, params: { userId: "2" } };

      await getFollowStatus(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("should return following true", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "2" } };
      (followService.isFollowing as jest.Mock).mockResolvedValue(true);

      await getFollowStatus(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ following: true });
    });

    it("should return following false", async () => {
      mockReq = { user: { id: "1", username: "test" }, params: { userId: "2" } };
      (followService.isFollowing as jest.Mock).mockResolvedValue(false);

      await getFollowStatus(mockReq as Request<{ userId: string }>, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ following: false });
    });
  });
});
