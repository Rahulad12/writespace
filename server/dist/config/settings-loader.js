"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const settingPath = path_1.default.join(__dirname, 'setting.json');
const localSettingPath = path_1.default.join(__dirname, 'setting.local.json');
function loadSettings() {
    const defaultSettings = JSON.parse(fs_1.default.readFileSync(settingPath, 'utf-8'));
    if (fs_1.default.existsSync(localSettingPath)) {
        const localSettings = JSON.parse(fs_1.default.readFileSync(localSettingPath, 'utf-8'));
        return {
            github: {
                ...defaultSettings.github,
                ...localSettings.github,
            },
        };
    }
    return defaultSettings;
}
exports.settings = loadSettings();
