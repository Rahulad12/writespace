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
const followService = __importStar(require("./follow.service"));
const follow_controller_1 = require("./follow.controller");
jest.mock("./follow.service");
describe("follow.controller", () => {
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
    describe("followUser", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { userId: "2" } };
            await (0, follow_controller_1.followUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should follow user and return 201", async () => {
            const mockFollow = { id: "1", follower_id: "1", following_id: "2", created_at: new Date() };
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "2" } };
            followService.followUser.mockResolvedValue(mockFollow);
            await (0, follow_controller_1.followUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "User followed successfully",
                follow: mockFollow,
            });
        });
        it("should return 400 when trying to follow yourself", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "1" } };
            followService.followUser.mockRejectedValue(new Error("Cannot follow yourself"));
            await (0, follow_controller_1.followUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Cannot follow yourself" });
        });
        it("should return 404 when user to follow not found", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "999" } };
            followService.followUser.mockRejectedValue(new Error("User not found"));
            await (0, follow_controller_1.followUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });
        it("should return 409 when already following", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "2" } };
            followService.followUser.mockRejectedValue({ code: "23505" });
            await (0, follow_controller_1.followUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(409);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Already following this user" });
        });
    });
    describe("unfollowUser", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { userId: "2" } };
            await (0, follow_controller_1.unfollowUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should unfollow user and return 204", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "2" } };
            followService.unfollowUser.mockResolvedValue(true);
            await (0, follow_controller_1.unfollowUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(204);
            expect(sendMock).toHaveBeenCalled();
        });
        it("should return 404 when follow relationship not found", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "999" } };
            followService.unfollowUser.mockResolvedValue(false);
            await (0, follow_controller_1.unfollowUser)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Follow relationship not found" });
        });
    });
    describe("getFollowers", () => {
        it("should return followers with 200", async () => {
            const mockFollowers = [
                { id: "1", user_id: "3", name: "alice", bio: "Alice bio" },
            ];
            mockReq = { params: { userId: "2" } };
            followService.getFollowers.mockResolvedValue(mockFollowers);
            await (0, follow_controller_1.getFollowers)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ followers: mockFollowers });
        });
        it("should return empty followers list", async () => {
            mockReq = { params: { userId: "1" } };
            followService.getFollowers.mockResolvedValue([]);
            await (0, follow_controller_1.getFollowers)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ followers: [] });
        });
    });
    describe("getFollowing", () => {
        it("should return following list with 200", async () => {
            const mockFollowing = [
                { id: "1", user_id: "5", name: "charlie", bio: "Charlie bio" },
                { id: "2", user_id: "6", name: "diana", bio: null },
            ];
            mockReq = { params: { userId: "1" } };
            followService.getFollowing.mockResolvedValue(mockFollowing);
            await (0, follow_controller_1.getFollowing)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ following: mockFollowing });
        });
        it("should return empty following list", async () => {
            mockReq = { params: { userId: "1" } };
            followService.getFollowing.mockResolvedValue([]);
            await (0, follow_controller_1.getFollowing)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ following: [] });
        });
    });
    describe("getFollowStatus", () => {
        it("should return 401 when user not authenticated", async () => {
            mockReq = { user: undefined, params: { userId: "2" } };
            await (0, follow_controller_1.getFollowStatus)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should return following true", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "2" } };
            followService.isFollowing.mockResolvedValue(true);
            await (0, follow_controller_1.getFollowStatus)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ following: true });
        });
        it("should return following false", async () => {
            mockReq = { user: { id: "1", name: "test" }, params: { userId: "2" } };
            followService.isFollowing.mockResolvedValue(false);
            await (0, follow_controller_1.getFollowStatus)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ following: false });
        });
    });
});
