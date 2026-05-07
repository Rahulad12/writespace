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
exports.checkBookmark = exports.getMyBookmarks = exports.removeBookmark = exports.addBookmark = void 0;
const bookmarkService = __importStar(require("./bookmark.service"));
const addBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.blogId;
        try {
            const bookmark = await bookmarkService.addBookmark(userId, blogId);
            res.status(201).json({
                message: "Blog bookmarked successfully",
                bookmark,
            });
        }
        catch (error) {
            const message = error.message;
            if (message === "Blog not found") {
                res.status(404).json({ message: "Blog not found" });
                return;
            }
            if (message === "Cannot bookmark a draft blog") {
                res.status(400).json({ message: "Cannot bookmark a draft blog" });
                return;
            }
            if (error.code === "23505") {
                res.status(409).json({ message: "Blog already bookmarked" });
                return;
            }
            throw error;
        }
    }
    catch (error) {
        console.error("Add bookmark error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addBookmark = addBookmark;
const removeBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.blogId;
        const removed = await bookmarkService.removeBookmark(userId, blogId);
        if (!removed) {
            res.status(404).json({ message: "Bookmark not found" });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        console.error("Remove bookmark error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.removeBookmark = removeBookmark;
const getMyBookmarks = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const bookmarks = await bookmarkService.getMyBookmarks(userId);
        res.status(200).json({ bookmarks });
    }
    catch (error) {
        console.error("Get bookmarks error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMyBookmarks = getMyBookmarks;
const checkBookmark = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.blogId;
        const bookmarked = await bookmarkService.isBookmarked(userId, blogId);
        res.status(200).json({ bookmarked });
    }
    catch (error) {
        console.error("Check bookmark error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkBookmark = checkBookmark;
