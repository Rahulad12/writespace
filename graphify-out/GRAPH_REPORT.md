# Graph Report - .  (2026-05-04)

## Corpus Check
- Corpus is ~1,341 words - fits in a single context window. You may not need a graph.

## Summary
- 41 nodes · 39 edges · 7 communities detected
- Extraction: 72% EXTRACTED · 28% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Comments and Likes Module|Comments and Likes Module]]
- [[_COMMUNITY_Authentication Module Core|Authentication Module Core]]
- [[_COMMUNITY_App Configuration and Bootstrap|App Configuration and Bootstrap]]
- [[_COMMUNITY_Auth Login Flow|Auth Login Flow]]
- [[_COMMUNITY_Auth Registration Flow|Auth Registration Flow]]
- [[_COMMUNITY_Post Types|Post Types]]
- [[_COMMUNITY_Project Rules (AGENTS.md)|Project Rules (AGENTS.md)]]

## God Nodes (most connected - your core abstractions)
1. `Express Application Setup` - 6 edges
2. `Posts Database Table` - 6 edges
3. `Auth Controller` - 5 edges
4. `Auth Routes` - 5 edges
5. `Database Pool Configuration` - 5 edges
6. `Comments Database Table` - 5 edges
7. `Environment Configuration` - 4 edges
8. `Users Database Table` - 4 edges
9. `login Handler Function` - 4 edges
10. `register Handler Function` - 3 edges

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

## Communities (16 total, 2 thin omitted)

### Community 0 - "Comments and Likes Module"
Cohesion: 0.24
Nodes (10): Comment Controller, Comment Routes, Comment Type Definitions, Comments Database Table, Likes Database Table, Post Routes, Post Type Definitions, Posts Database Table (+2 more)

### Community 1 - "Authentication Module Core"
Cohesion: 0.4
Nodes (6): Auth Controller, Auth Middleware, Auth Routes, Auth Type Definitions, Auth Validation Schemas, Validator Middleware

### Community 2 - "App Configuration and Bootstrap"
Cohesion: 0.6
Nodes (5): Express Application Setup, Database Pool Configuration, Environment Configuration, Environment Variable Types, Server Entry Point

### Community 3 - "Auth Login Flow"
Cohesion: 0.5
Nodes (4): login Handler Function, LoginBody Type, UserRow Interface, loginSchema Zod Schema

### Community 5 - "Auth Registration Flow"
Cohesion: 0.67
Nodes (3): register Handler Function, RegisterBody Type, registerSchema Zod Schema

## Knowledge Gaps
- **11 isolated node(s):** `post.types.ts`, `Comment Controller`, `Comment Type Definitions`, `Post Type Definitions`, `Post Controller` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Auth Controller` connect `Authentication Module Core` to `Comments and Likes Module`, `App Configuration and Bootstrap`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `Database Pool Configuration` connect `App Configuration and Bootstrap` to `Authentication Module Core`, `Auth Login Flow`, `Auth Registration Flow`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `Express Application Setup` connect `App Configuration and Bootstrap` to `Comments and Likes Module`, `Authentication Module Core`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Express Application Setup` (e.g. with `Comment Routes` and `Post Routes`) actually correct?**
  _`Express Application Setup` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Posts Database Table` (e.g. with `Post Type Definitions` and `Post Controller`) actually correct?**
  _`Posts Database Table` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `post.types.ts`, `Comment Controller`, `Comment Type Definitions` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._