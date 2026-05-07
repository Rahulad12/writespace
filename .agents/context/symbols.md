# Symbols Index
**Generated**: 2026-05-06

## Client
- `client/src/App.tsx` — App (React.FC) — BrowserRouter with routes: /, /login, /register, /profile (protected). Imports only from module barrels.
- `client/src/main.tsx` — ReactDOM.createRoot entry
- `client/src/shared/config/apiClient.ts` — apiClient (axios instance) — baseURL /api, JWT request interceptor, 401 response handler
- `client/src/shared/hooks/useAuth.ts` — useAuth (Zustand) — auth state: user, token, isAuthenticated, login(), logout()
- `client/src/shared/components/ProtectedRoute.tsx` — ProtectedRoute (React.FC) — redirects to /login if not authenticated
- `client/src/modules/auth/index.ts` — barrel: re-exports LoginPage, RegisterPage, types
- `client/src/modules/auth/page.tsx` — AuthPage (mode: login|register), LoginPage, RegisterPage
- `client/src/modules/auth/types.ts` — LoginPayload, RegisterPayload, User, AuthResponse, UserProfileResponse
- `client/src/modules/auth/services/auth.service.ts` — login, register, getCurrentUser
- `client/src/modules/auth/hooks/useAuthForm.ts` — useAuthForm() — loading, error, setLoading, setError, handleError
- `client/src/modules/auth/components/LoginForm.tsx` — LoginForm (React.FC) — identifier + password form with antd validation
- `client/src/modules/auth/components/RegisterForm.tsx` — RegisterForm (React.FC) — username, email, password, confirmPassword with match validation
- `client/src/modules/home/index.ts` — barrel: re-exports HomePage
- `client/src/modules/home/page.tsx` — HomePage (React.FC) — displays auth state with login/register/logout buttons

## Server Migrations
- `server/migrations/001_create_users.ts:3` — up (MigrationBuilder)
- `server/migrations/001_create_users.ts:18` — down (MigrationBuilder)
- `server/migrations/002_create_blogs.ts:3` — up (MigrationBuilder)
- `server/migrations/002_create_blogs.ts:22` — down (MigrationBuilder)
- `server/migrations/003_create_bookmarks.ts:3` — up (MigrationBuilder)
- `server/migrations/003_create_bookmarks.ts:19` — down (MigrationBuilder)
- `server/migrations/004_create_follows.ts:3` — up (MigrationBuilder)
- `server/migrations/004_create_follows.ts:23` — down (MigrationBuilder)

## Server App
- `server/src/app.ts:37` — export default app

## Server Config
- `server/src/config/db.ts:4` — pool (Pool)
- `server/src/config/env.ts:6` — env

## Server Auth Module
- `server/src/modules/auth/auth.controller.ts:16` — register (req, res)
- `server/src/modules/auth/auth.controller.ts:45` — login (req, res)
- `server/src/modules/auth/auth.routes.ts:10` — export default authRouter
- `server/src/modules/auth/auth.types.ts:4` — RegisterBody (z.infer)
- `server/src/modules/auth/auth.types.ts:5` — LoginBody (z.infer)
- `server/src/modules/auth/auth.types.ts:7` — UserRow (interface)
- `server/src/modules/auth/auth.validation.schema.ts:3` — registerSchema
- `server/src/modules/auth/auth.validation.schema.ts:9` — loginSchema

## Server Blog Module
- `server/src/modules/blog/blog.controller.ts:5` — createBlog (req, res)
- `server/src/modules/blog/blog.controller.ts:27` — getBlogs (req, res)
- `server/src/modules/blog/blog.controller.ts:48` — getMyDrafts (req, res)
- `server/src/modules/blog/blog.controller.ts:68` — getBlogById (req, res)
- `server/src/modules/blog/blog.controller.ts:97` — publishDraft (req, res)
- `server/src/modules/blog/blog.controller.ts:126` — updateBlog (req, res)
- `server/src/modules/blog/blog.controller.ts:155` — deleteBlog (req, res)
- `server/src/modules/blog/blog.routes.ts:17` — export default blogRouter
- `server/src/modules/blog/blog.service.ts:4` — createBlog (authorId, data)
- `server/src/modules/blog/blog.service.ts:21` — getBlogById (id)
- `server/src/modules/blog/blog.service.ts:33` — getBlogs (options?)
- `server/src/modules/blog/blog.service.ts:70` — getMyDrafts (authorId)
- `server/src/modules/blog/blog.service.ts:81` — publishDraft (id, authorId)
- `server/src/modules/blog/blog.service.ts:102` — updateBlog (id, authorId, data)
- `server/src/modules/blog/blog.service.ts:153` — deleteBlog (id, authorId)
- `server/src/modules/blog/blog.types.ts:3` — createBlogSchema
- `server/src/modules/blog/blog.types.ts:9` — updateBlogSchema
- `server/src/modules/blog/blog.types.ts:15` — CreateBlogBody (z.infer)
- `server/src/modules/blog/blog.types.ts:16` — UpdateBlogBody (z.infer)
- `server/src/modules/blog/blog.types.ts:18` — BlogRow (interface)
- `server/src/modules/blog/blog.types.ts:29` — BlogWithAuthor (interface)

## Server Bookmark Module
- `server/src/modules/bookmark/bookmark.controller.ts:4` — addBookmark (req, res)
- `server/src/modules/bookmark/bookmark.controller.ts:45` — removeBookmark (req, res)
- `server/src/modules/bookmark/bookmark.controller.ts:71` — getMyBookmarks (req, res)
- `server/src/modules/bookmark/bookmark.controller.ts:91` — checkBookmark (req, res)
- `server/src/modules/bookmark/bookmark.routes.ts:12` — export default bookmarkRouter
- `server/src/modules/bookmark/bookmark.service.ts:4` — addBookmark (userId, blogId)
- `server/src/modules/bookmark/bookmark.service.ts:25` — removeBookmark (userId, blogId)
- `server/src/modules/bookmark/bookmark.service.ts:34` — getMyBookmarks (userId)
- `server/src/modules/bookmark/bookmark.service.ts:50` — isBookmarked (userId, blogId)
- `server/src/modules/bookmark/bookmark.types.ts:3` — BookmarkRow (interface)
- `server/src/modules/bookmark/bookmark.types.ts:10` — BookmarkedBlog (interface)

## Server Follow Module
- `server/src/modules/follow/follow.controller.ts:4` — followUser (req, res)
- `server/src/modules/follow/follow.controller.ts:45` — unfollowUser (req, res)
- `server/src/modules/follow/follow.controller.ts:71` — getFollowers (req, res)
- `server/src/modules/follow/follow.controller.ts:87` — getFollowing (req, res)
- `server/src/modules/follow/follow.controller.ts:103` — getFollowStatus (req, res)
- `server/src/modules/follow/follow-profile.routes.ts:11` — export default userFollowRouter
- `server/src/modules/follow/follow.routes.ts:10` — export default followRouter
- `server/src/modules/follow/follow.service.ts:4` — followUser (followerId, followingId)
- `server/src/modules/follow/follow.service.ts:27` — unfollowUser (followerId, followingId)
- `server/src/modules/follow/follow.service.ts:36` — getFollowers (userId)
- `server/src/modules/follow/follow.service.ts:47` — getFollowing (userId)
- `server/src/modules/follow/follow.service.ts:58` — isFollowing (followerId, followingId)
- `server/src/modules/follow/follow.types.ts:3` — FollowRow (interface)
- `server/src/modules/follow/follow.types.ts:9` — FollowWithProfile (interface)
- `server/src/modules/follow/follow.types.ts:15` — followUserSchema

## Server User Module
- `server/src/modules/user/user.controller.ts:4` — getUserProfile (req, res)
- `server/src/modules/user/user.controller.ts:26` — getCurrentUserProfile (req, res)
- `server/src/modules/user/user.controller.ts:52` — updateUserProfile (req, res)
- `server/src/modules/user/user.routes.ts:15` — export default userRouter
- `server/src/modules/user/user.service.ts:4` — getUserProfile (userId, requesterId?)
- `server/src/modules/user/user.service.ts:40` — getCurrentUserProfile (userId)
- `server/src/modules/user/user.service.ts:68` — updateUserProfile (userId, data)
- `server/src/modules/user/user.types.ts:3` — UserProfileRow (interface)
- `server/src/modules/user/user.types.ts:13` — UserProfileResponse (interface)
- `server/src/modules/user/user.types.ts:23` — UserProfileWithFollow (interface)
- `server/src/modules/user/user.types.ts:33` — updateProfileSchema
- `server/src/modules/user/user.types.ts:38` — UpdateProfileBody (z.infer)

## Server Shared Middleware
- `server/src/shared/middleware/auth.middleware.ts:5` — authenticateToken (req, res, next)
- `server/src/shared/middleware/auth.middleware.ts:25` — optionalAuth (req, res, next)
- `server/src/shared/middleware/validator.ts:4` — validate (schema)

## Server Shared Types
- `server/src/shared/types/env.types.ts:1` — EnvTypes (interface)
- `server/src/shared/types/env.types.ts:12` — GithubSettings (interface)
- `server/src/shared/types/env.types.ts:17` — AppSettings (interface)
- `server/src/shared/types/express.d.ts:1` — DecodedUser (interface)
