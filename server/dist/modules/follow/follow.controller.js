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
exports.getFollowStatus = exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const followService = __importStar(require("./follow.service"));
const followUser = async (req, res) => {
    try {
        const followerId = req.user?.id;
        if (!followerId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const followingId = req.params.userId;
        try {
            const follow = await followService.followUser(followerId, followingId);
            res.status(201).json({
                message: "User followed successfully",
                follow,
            });
        }
        catch (error) {
            const message = error.message;
            if (message === "Cannot follow yourself") {
                res.status(400).json({ message: "Cannot follow yourself" });
                return;
            }
            if (message === "User not found") {
                res.status(404).json({ message: "User not found" });
                return;
            }
            if (error.code === "23505") {
                res.status(409).json({ message: "Already following this user" });
                return;
            }
            throw error;
        }
    }
    catch (error) {
        console.error("Follow user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    try {
        const followerId = req.user?.id;
        if (!followerId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const followingId = req.params.userId;
        const removed = await followService.unfollowUser(followerId, followingId);
        if (!removed) {
            res.status(404).json({ message: "Follow relationship not found" });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Unfollow user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.unfollowUser = unfollowUser;
const getFollowers = async (req, res) => {
    try {
        const userId = req.params.userId;
        const followers = await followService.getFollowers(userId);
        res.status(200).json({ followers });
    }
    catch (error) {
        console.error("Get followers error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFollowers = getFollowers;
const getFollowing = async (req, res) => {
    try {
        const userId = req.params.userId;
        const following = await followService.getFollowing(userId);
        res.status(200).json({ following });
    }
    catch (error) {
        console.error("Get following error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFollowing = getFollowing;
const getFollowStatus = async (req, res) => {
    try {
        const followerId = req.user?.id;
        if (!followerId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const followingId = req.params.userId;
        const following = await followService.isFollowing(followerId, followingId);
        res.status(200).json({ following });
    }
    catch (error) {
        console.error("Get follow status error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFollowStatus = getFollowStatus;
