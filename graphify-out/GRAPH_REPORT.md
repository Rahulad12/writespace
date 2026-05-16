# Graph Report - writespace  (2026-05-07)

## Corpus Check
- 73 files · ~16,278 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 298 nodes · 381 edges · 56 communities (48 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `845a21c1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 55|Community 55]]

## God Nodes (most connected - your core abstractions)
1. `writespace` - 17 edges
2. `writespace — Agents Instructions` - 11 edges
3. `authenticateToken()` - 8 edges
4. `validate()` - 7 edges
5. `Installation` - 7 edges
6. `Test Cases: Authentication & Registration` - 7 edges
7. `Test Cases: Blog Management (CRUD)` - 7 edges
8. `register()` - 6 edges
9. `login()` - 6 edges
10. `Test Cases: Follow System` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Express Application Setup` --conceptually_related_to--> `Comment Routes`  [INFERRED]
  server/src/app.ts → server/src/modules/comment/comment.routes.ts
- `Express Application Setup` --conceptually_related_to--> `Post Routes`  [INFERRED]
  server/src/app.ts → server/src/modules/post/post.routes.ts
- `Auth Middleware` --conceptually_related_to--> `Auth Controller`  [INFERRED]
  server/src/shared/middleware/auth.middleware.ts → server/src/modules/auth/auth.controller.ts
- `Auth Middleware` --conceptually_related_to--> `Auth Routes`  [INFERRED]
  server/src/shared/middleware/auth.middleware.ts → server/src/modules/auth/auth.routes.ts
- `Comment Controller` --conceptually_related_to--> `Comments Database Table`  [INFERRED]
  server/src/modules/comment/comment.controller.ts → server/src/shared/database-table/comments-table.sql

## Hyperedges (group relationships)
- **Authentication Module Components** — auth_controller_ts_auth_controller, auth_routes_ts_auth_routes, auth_types_ts_auth_types, auth_validation_schema_ts_auth_validation [EXTRACTED 1.00]
- **Database Schema Tables** — users_table_sql_users_table, posts_table_sql_posts_table, comments_table_sql_comments_table, likes_table_sql_likes_table [EXTRACTED 1.00]
- **Post Module Scaffolds** — post_types_ts_post_types, psot_controller_ts_post_controller, post_routes_ts_post_routes [INFERRED 0.90]
- **Comment Module Scaffolds** — comment_controller_ts_comment_controller, comment_routes_ts_comment_routes, comment_types_ts_comment_types [INFERRED 0.90]
- **Server Startup Chain** — index_ts_server_entry, app_ts_express_app, db_ts_database_pool, env_ts_env_config [EXTRACTED 1.00]

## Communities (56 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (12): followUser(), getFollowers(), getFollowing(), getFollowStatus(), unfollowUser(), authenticateToken(), optionalAuth(), getCurrentUserProfile() (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (29): API Conventions, Authentication, Code Quality, code:block1 (writespace/), code:bash (cd server), code:bash (cd server), code:bash (cd client), code:block16 (├── routes.ts      ← Express route handlers) (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.1
Nodes (28): Express Application Setup, Auth Controller, login Handler Function, register Handler Function, Auth Middleware, Auth Routes, Auth Type Definitions, LoginBody Type (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (4): LoginForm(), useAuthForm(), login(), register()

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (16): Client, code:bash (# 1. Refresh codebase context), code:bash (cd client && npm run dev), code:bash (cd server && npm run dev), Critical Rules — NEVER Break, Dev Commands, Feature Workflow, Key Files (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): Building for Production, code:bash (cd server), code:bash (cd server), code:bash (cd client), code:bash (git clone https://github.com/Rahulad12/writespace.git), code:bash (cd server), code:env (PORT=5000), code:bash (createdb writespace) (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (4): generateToken(), login(), register(), validate()

### Community 8 - "Community 8"
Cohesion: 0.5
Nodes (7): createBlog(), deleteBlog(), getBlogById(), getBlogs(), getMyDrafts(), publishDraft(), updateBlog()

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (7): createBlog(), deleteBlog(), getBlogById(), getBlogs(), getMyDrafts(), publishDraft(), updateBlog()

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): TC-AUTH-01: Successful User Registration, TC-AUTH-02: Registration with Existing Email, TC-AUTH-03: Registration with Invalid Data, TC-AUTH-04: Successful User Login, TC-AUTH-05: Login with Invalid Credentials, TC-AUTH-06: Access Restricted Route Without Auth, Test Cases: Authentication & Registration

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): TC-BLOG-01: Create a Published Blog, TC-BLOG-02: Create Blog with Missing Fields, TC-BLOG-03: Update Own Blog, TC-BLOG-04: Update Someone Else's Blog, TC-BLOG-05: Delete Own Blog, TC-BLOG-06: Public Access to Blogs, Test Cases: Blog Management (CRUD)

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (4): addBookmark(), checkBookmark(), getMyBookmarks(), removeBookmark()

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): TC-FOLLOW-01: Follow a User, TC-FOLLOW-02: Prevent Self-Follow, TC-FOLLOW-03: Unfollow a User, TC-FOLLOW-04: View Followers/Following, TC-FOLLOW-05: Duplicate Follow Prevention, Test Cases: Follow System

### Community 14 - "Community 14"
Cohesion: 0.29
Nodes (6): TC-BOOK-01: Bookmark a Blog, TC-BOOK-02: Duplicate Bookmark Prevention, TC-BOOK-03: Remove a Bookmark, TC-BOOK-04: View Own Bookmarks, TC-BOOK-05: Bookmark Guest Access, Test Cases: Bookmark System

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): TC-PROFILE-01: View Public Profile (Guest), TC-PROFILE-02: View Own Profile (Authenticated), TC-PROFILE-03: Update Own Profile, TC-PROFILE-04: Update Profile Validation, Test Cases: User Profile

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (5): TC-DRAFT-01: Save Blog as Draft, TC-DRAFT-02: View Own Drafts, TC-DRAFT-03: Draft Privacy, TC-DRAFT-04: Publish a Draft, Test Cases: Draft System

## Knowledge Gaps
- **87 isolated node(s):** `code:bash (# 1. Refresh codebase context)`, `Post-Task / End of Session — Mandatory Steps`, `Critical Rules — NEVER Break`, `code:bash (cd client && npm run dev)`, `code:bash (cd server && npm run dev)` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `writespace` connect `Community 1` to `Community 6`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `Getting Started` connect `Community 6` to `Community 1`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `validate()` connect `Community 7` to `Community 8`, `Community 0`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `code:bash (# 1. Refresh codebase context)`, `Post-Task / End of Session — Mandatory Steps`, `Critical Rules — NEVER Break` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._