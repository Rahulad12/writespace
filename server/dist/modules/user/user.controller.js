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
exports.updateUserProfile = exports.getCurrentUserProfile = exports.getUserProfile = void 0;
const userService = __importStar(require("./user.service"));
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const profile = await userService.getUserProfile(userId, req.user?.id);
        if (!profile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserProfile = getUserProfile;
const getCurrentUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const profile = await userService.getCurrentUserProfile(userId);
        if (!profile) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error("Get current user profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCurrentUserProfile = getCurrentUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const result = await userService.updateUserProfile(userId, req.body);
        if (!result.success) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "Profile updated successfully",
            profile: result.profile,
        });
    }
    catch (error) {
        console.error("Update user profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUserProfile = updateUserProfile;
