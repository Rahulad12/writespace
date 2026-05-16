import * as followService from "./follow.service";
import { pool } from "../../config/db";

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
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [{ id: "2" }] })
        .mockResolvedValueOnce({ rows: [mockFollow] });

      const result = await followService.followUser("1", "2");

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        "SELECT 1 FROM users WHERE id = $1",
        ["2"]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO follows"),
        ["1", "2"]
      );
      expect(result).toEqual(mockFollow);
    });

    it("should throw error when trying to follow yourself", async () => {
      await expect(followService.followUser("1", "1")).rejects.toThrow(
        "Cannot follow yourself"
      );
    });

    it("should throw error when user to follow does not exist", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      await expect(followService.followUser("1", "999")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("unfollowUser", () => {
    it("should remove a follow relationship and return true", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });

      const result = await followService.unfollowUser("1", "2");

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
        ["1", "2"]
      );
      expect(result).toBe(true);
    });

    it("should return false when follow relationship not found", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

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
      (pool.query as jest.Mock).mockResolvedValue({ rows: mockFollowers });

      const result = await followService.getFollowers("2");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT f.id, u.id as user_id"),
        ["2"]
      );
      expect(result).toEqual(mockFollowers);
    });

    it("should return empty array when no followers", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await followService.getFollowers("1");

      expect(result).toEqual([]);
    });
  });

  describe("getFollowing", () => {
    it("should return list of users being followed", async () => {
      const mockFollowing = [
        { id: "1", user_id: "5", name: "charlie", bio: "Charlie bio", created_at: new Date() },
      ];
      (pool.query as jest.Mock).mockResolvedValue({ rows: mockFollowing });

      const result = await followService.getFollowing("1");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("FROM follows f"),
        ["1"]
      );
      expect(result).toEqual(mockFollowing);
    });

    it("should return empty array when not following anyone", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await followService.getFollowing("1");

      expect(result).toEqual([]);
    });
  });

  describe("isFollowing", () => {
    it("should return true when following", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: "1" }] });

      const result = await followService.isFollowing("1", "2");

      expect(result).toBe(true);
    });

    it("should return false when not following", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      const result = await followService.isFollowing("1", "2");

      expect(result).toBe(false);
    });
  });
});
