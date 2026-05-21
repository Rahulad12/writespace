import * as userService from "./user.service";
import { pool } from "../../config/db";
import { UpdateProfileBody } from "./user.types";

jest.mock("../../config/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("should return user profile with published blog count", async () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "Test bio",
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "5" }] });

      const result = await userService.getUserProfile("1");

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("published_blog_count", 5);
      expect(result).toHaveProperty("username", "testuser");
    });

    it("should return null when user not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.getUserProfile("999");

      expect(result).toBeNull();
    });

    it("should include is_following when requester is different user", async () => {
      const mockUser = {
        id: "2",
        username: "other",
        email: "other@example.com",
        bio: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "0" }] })
        .mockResolvedValueOnce({ rows: [{ id: "1" }] });

      const result = await userService.getUserProfile("2", "1");

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("is_following", true);
    });

    it("should not include is_following when viewing own profile", async () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "My bio",
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "3" }] });

      const result = await userService.getUserProfile("1", "1");

      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty("is_following");
    });
  });

  describe("getCurrentUserProfile", () => {
    it("should return current user profile", async () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "My bio",
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "2" }] });

      const result = await userService.getCurrentUserProfile("1");

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("username", "testuser");
      expect(result).toHaveProperty("published_blog_count", 2);
    });

    it("should return null when user not found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await userService.getCurrentUserProfile("999");

      expect(result).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("should update username and bio", async () => {
      const mockUser = {
        id: "1",
        username: "newname",
        email: "test@example.com",
        bio: "New bio",
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "1" }] });

      const updateData: UpdateProfileBody = {
        username: "newname",
        bio: "New bio",
      };

      const result = await userService.updateUserProfile("1", updateData);

      expect(result.success).toBe(true);
      expect(result.profile).toHaveProperty("username", "newname");
      expect(result.profile).toHaveProperty("bio", "New bio");
    });

    it("should return current profile when no updates provided", async () => {
      const mockUser = {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        bio: "Bio",
        created_at: new Date(),
        updated_at: new Date(),
      };
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({ rows: [{ count: "0" }] });

      const result = await userService.updateUserProfile("1", {});

      expect(result.success).toBe(true);
      expect(result.profile).toHaveProperty("username", "testuser");
    });
  });
});
