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
const userService = __importStar(require("./user.service"));
const user_controller_1 = require("./user.controller");
jest.mock("./user.service");
describe("user.controller", () => {
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
    describe("getUserProfile", () => {
        it("should return user profile with 200", async () => {
            const mockProfile = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "Test bio",
                created_at: new Date(),
                published_blog_count: 5,
            };
            mockReq = { params: { userId: "1" }, user: undefined };
            userService.getUserProfile.mockResolvedValue(mockProfile);
            await (0, user_controller_1.getUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ profile: mockProfile });
        });
        it("should return 404 when user not found", async () => {
            mockReq = { params: { userId: "999" } };
            userService.getUserProfile.mockResolvedValue(null);
            await (0, user_controller_1.getUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });
        it("should pass requester id when authenticated", async () => {
            mockReq = { params: { userId: "2" }, user: { id: "1", name: "requester" } };
            userService.getUserProfile.mockResolvedValue({ id: "2" });
            await (0, user_controller_1.getUserProfile)(mockReq, mockRes);
            expect(userService.getUserProfile).toHaveBeenCalledWith("2", "1");
        });
    });
    describe("getCurrentUserProfile", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = { user: undefined };
            await (0, user_controller_1.getCurrentUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should return current user profile", async () => {
            const mockProfile = {
                id: "1",
                name: "testuser",
                email: "test@example.com",
                bio: "My bio",
                created_at: new Date(),
                published_blog_count: 3,
            };
            mockReq = { user: { id: "1", name: "testuser" } };
            userService.getCurrentUserProfile.mockResolvedValue(mockProfile);
            await (0, user_controller_1.getCurrentUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({ profile: mockProfile });
        });
        it("should return 404 when user not found", async () => {
            mockReq = { user: { id: "999", name: "ghost" } };
            userService.getCurrentUserProfile.mockResolvedValue(null);
            await (0, user_controller_1.getCurrentUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
    describe("updateUserProfile", () => {
        it("should return 401 when not authenticated", async () => {
            mockReq = { user: undefined, body: { name: "newname" } };
            await (0, user_controller_1.updateUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith({ message: "Authentication required" });
        });
        it("should update profile and return 200", async () => {
            const mockProfile = {
                id: "1",
                name: "newname",
                email: "test@example.com",
                bio: "New bio",
                created_at: new Date(),
                published_blog_count: 3,
            };
            mockReq = {
                user: { id: "1", name: "testuser" },
                body: { name: "newname", bio: "New bio" },
            };
            userService.updateUserProfile.mockResolvedValue({
                success: true,
                profile: mockProfile,
            });
            await (0, user_controller_1.updateUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                message: "Profile updated successfully",
                profile: mockProfile,
            });
        });
        it("should return 404 when user not found", async () => {
            mockReq = {
                user: { id: "999", name: "ghost" },
                body: { name: "newname" },
            };
            userService.updateUserProfile.mockResolvedValue({
                success: false,
                error: "User not found",
            });
            await (0, user_controller_1.updateUserProfile)(mockReq, mockRes);
            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
});
