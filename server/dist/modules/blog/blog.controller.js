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
exports.deleteBlog = exports.updateBlog = exports.publishDraft = exports.getBlogById = exports.getMyDrafts = exports.getBlogs = exports.createBlog = void 0;
const blogService = __importStar(require("./blog.service"));
const createBlog = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blog = await blogService.createBlog(userId, req.body);
        res.status(201).json({
            message: "Blog created successfully",
            blog,
        });
    }
    catch (error) {
        console.error("Create blog error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createBlog = createBlog;
const getBlogs = async (req, res) => {
    try {
        const { authorId, status, limit, offset } = req.query;
        const blogs = await blogService.getBlogs({
            authorId: authorId,
            status: status,
            limit: limit ? parseInt(limit) : undefined,
            offset: offset ? parseInt(offset) : undefined,
        });
        res.status(200).json({ blogs });
    }
    catch (error) {
        console.error("Get blogs error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getBlogs = getBlogs;
const getMyDrafts = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const drafts = await blogService.getMyDrafts(userId);
        res.status(200).json({ drafts });
    }
    catch (error) {
        console.error("Get my drafts error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMyDrafts = getMyDrafts;
const getBlogById = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await blogService.getBlogById(blogId);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        // Only allow viewing drafts if user is the author
        if (blog.status === "draft") {
            const userId = req.user?.id;
            if (!userId || userId !== blog.author_id) {
                res.status(404).json({ message: "Blog not found" });
                return;
            }
        }
        res.status(200).json({ blog });
    }
    catch (error) {
        console.error("Get blog error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getBlogById = getBlogById;
const publishDraft = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.id;
        const blog = await blogService.publishDraft(blogId, userId);
        if (!blog) {
            res.status(404).json({ message: "Draft not found or unauthorized" });
            return;
        }
        res.status(200).json({
            message: "Blog published successfully",
            blog,
        });
    }
    catch (error) {
        console.error("Publish draft error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.publishDraft = publishDraft;
const updateBlog = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.id;
        const blog = await blogService.updateBlog(blogId, userId, req.body);
        if (!blog) {
            res.status(404).json({ message: "Blog not found or unauthorized" });
            return;
        }
        res.status(200).json({
            message: "Blog updated successfully",
            blog,
        });
    }
    catch (error) {
        console.error("Update blog error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const blogId = req.params.id;
        const deleted = await blogService.deleteBlog(blogId, userId);
        if (!deleted) {
            res.status(404).json({ message: "Blog not found or unauthorized" });
            return;
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    }
    catch (error) {
        console.error("Delete blog error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteBlog = deleteBlog;
