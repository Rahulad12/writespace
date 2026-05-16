"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const blog_routes_1 = __importDefault(require("./modules/blog/blog.routes"));
const bookmark_routes_1 = __importDefault(require("./modules/bookmark/bookmark.routes"));
const follow_routes_1 = __importDefault(require("./modules/follow/follow.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const app = (0, express_1.default)();
// // Connect to database
db_1.pool.connect().then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.error('Database connection error', err);
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/bookmarks', bookmark_routes_1.default);
app.use('/api/follows', follow_routes_1.default);
app.use('/api/users', user_routes_1.default);
// Routes
app.get('/', (_req, res) => {
    res.send('Hello World!');
});
exports.default = app;
