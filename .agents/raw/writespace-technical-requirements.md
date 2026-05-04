# Writespace – Technical Requirements (MVP)

---

## 🔐 Authentication & Authorization

### Requirements
- Implement session-based or token-based authentication (JWT recommended)
- Protect all restricted routes with auth middleware
- Store intended route before redirecting to login; restore after successful auth
- Differentiate guest and authenticated roles at the API level

### Auth Flow
```mermaid
flowchart TD
    A([Request to Restricted Route]) --> B{Auth Token Valid?}
    B -- No --> C[Store Intended URL in Session]
    C --> D[Redirect to Login]
    D --> E[User Submits Credentials]
    E --> F{Credentials Valid?}
    F -- No --> G[Return 401 + Error Message]
    G --> E
    F -- Yes --> H[Issue Auth Token]
    H --> I{Intended URL Stored?}
    I -- Yes --> J[Redirect to Intended URL]
    I -- No --> K[Redirect to Home Feed]
```

---

## 📝 Blog CRUD

### Requirements
- `POST /blogs` — Create blog (auth required)
- `PUT /blogs/:id` — Update blog (author only)
- `DELETE /blogs/:id` — Delete blog (author only), soft delete preferred
- `GET /blogs` — List all published blogs (public)
- `GET /blogs/:id` — Get single blog (public)
- Enforce author ownership check on edit/delete at the API level
- Title and content fields are required; return `400` if missing

### Blog Write Flow
```mermaid
flowchart TD
    A([POST /blogs or PUT /blogs/:id]) --> B{Auth Token Present?}
    B -- No --> C[Return 401 Unauthorized]
    B -- Yes --> D{Title & Content Present?}
    D -- No --> E[Return 400 Bad Request]
    D -- Yes --> F{Action?}
    F -- Publish --> G[Set status = published]
    F -- Draft --> H[Set status = draft]
    G --> I[Save to DB]
    H --> I
    I --> J[Return 201 / 200 with Blog Object]
```

---

## 📋 Draft System

### Requirements
- Drafts stored with `status = draft` in the blogs table
- `GET /blogs/drafts` — Return only current user's drafts (auth required)
- Draft visibility enforced at query level — filter by `author_id = current_user`
- `PUT /blogs/:id/publish` — Transition draft to published
- Drafts must never appear in public blog feed

### Draft Visibility Rule
```mermaid
flowchart TD
    A([GET /blogs]) --> B[Query: status = published]
    B --> C[Return Public Feed]

    D([GET /blogs/drafts]) --> E{Authenticated?}
    E -- No --> F[Return 401]
    E -- Yes --> G[Query: status = draft AND author_id = current_user]
    G --> H[Return User's Drafts Only]
```

---

## 🔖 Bookmark System

### Requirements
- `POST /bookmarks/:blogId` — Add bookmark (auth required)
- `DELETE /bookmarks/:blogId` — Remove bookmark (auth required)
- `GET /bookmarks` — List current user's bookmarks (auth required)
- Bookmarks table: `user_id`, `blog_id`, `created_at`
- Unique constraint on `(user_id, blog_id)` to prevent duplicates
- Return `409` if bookmark already exists

### Bookmark Flow
```mermaid
flowchart TD
    A([POST /bookmarks/:blogId]) --> B{Authenticated?}
    B -- No --> C[Return 401]
    B -- Yes --> D{Bookmark Exists?}
    D -- Yes --> E[Return 409 Conflict]
    D -- No --> F[Insert into bookmarks table]
    F --> G[Return 201 Created]

    H([DELETE /bookmarks/:blogId]) --> I{Authenticated?}
    I -- No --> J[Return 401]
    I -- Yes --> K{Bookmark Exists?}
    K -- No --> L[Return 404]
    K -- Yes --> M[Delete from bookmarks table]
    M --> N[Return 200 OK]
```

---

## 👥 Follow System

### Requirements
- `POST /follow/:userId` — Follow a user (auth required)
- `DELETE /follow/:userId` — Unfollow a user (auth required)
- `GET /users/:userId/followers` — List followers (public)
- `GET /users/:userId/following` — List following (public)
- Follows table: `follower_id`, `following_id`, `created_at`
- Unique constraint on `(follower_id, following_id)`
- Prevent self-follow at API level; return `400`

### Follow Flow
```mermaid
flowchart TD
    A([POST /follow/:userId]) --> B{Authenticated?}
    B -- No --> C[Return 401]
    B -- Yes --> D{Self-follow?}
    D -- Yes --> E[Return 400 Bad Request]
    D -- No --> F{Already Following?}
    F -- Yes --> G[Return 409 Conflict]
    F -- No --> H[Insert into follows table]
    H --> I[Return 201 Created]
```

---

## 👤 User Profile

### Requirements
- `GET /users/:userId` — Public profile (name, bio, published blogs)
- `PUT /users/me` — Update own profile (auth required)
- Profile response for own user includes: drafts count, bookmarks count
- Profile response for other users excludes: drafts, bookmarks
- Validate bio length and name on update; return `400` on failure

### Profile Access Control
```mermaid
flowchart TD
    A([GET /users/:userId]) --> B{Authenticated?}
    B -- No --> C[Return Public Profile]
    C --> D[name, bio, published blogs]

    B -- Yes --> E{Own Profile?}
    E -- No --> F[Return Public Profile + Follow Status]
    E -- Yes --> G[Return Full Profile]
    G --> H[name, bio, published blogs,\ndrafts count, bookmarks count]
```

---

## 🗄️ Data Model

```mermaid
erDiagram
    USERS {
        uuid id PK
        string name
        string email
        string password_hash
        string bio
        timestamp created_at
    }

    BLOGS {
        uuid id PK
        uuid author_id FK
        string title
        text content
        enum status
        timestamp created_at
        timestamp updated_at
    }

    BOOKMARKS {
        uuid user_id FK
        uuid blog_id FK
        timestamp created_at
    }

    FOLLOWS {
        uuid follower_id FK
        uuid following_id FK
        timestamp created_at
    }

    USERS ||--o{ BLOGS : "authors"
    USERS ||--o{ BOOKMARKS : "saves"
    BLOGS ||--o{ BOOKMARKS : "bookmarked in"
    USERS ||--o{ FOLLOWS : "follows"
```

---

## 🌐 API Summary

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/auth/login` | ❌ | Login and receive token |
| `POST` | `/auth/register` | ❌ | Register new user |
| `GET` | `/blogs` | ❌ | List all published blogs |
| `GET` | `/blogs/:id` | ❌ | Get single blog |
| `POST` | `/blogs` | ✅ | Create blog |
| `PUT` | `/blogs/:id` | ✅ | Update own blog |
| `DELETE` | `/blogs/:id` | ✅ | Delete own blog |
| `GET` | `/blogs/drafts` | ✅ | List own drafts |
| `PUT` | `/blogs/:id/publish` | ✅ | Publish a draft |
| `GET` | `/users/:id` | ❌ | View user profile |
| `PUT` | `/users/me` | ✅ | Edit own profile |
| `POST` | `/bookmarks/:blogId` | ✅ | Bookmark a blog |
| `DELETE` | `/bookmarks/:blogId` | ✅ | Remove bookmark |
| `GET` | `/bookmarks` | ✅ | List own bookmarks |
| `POST` | `/follow/:userId` | ✅ | Follow a user |
| `DELETE` | `/follow/:userId` | ✅ | Unfollow a user |
| `GET` | `/users/:id/followers` | ❌ | List followers |
| `GET` | `/users/:id/following` | ❌ | List following |

---

## ✅ Validation Rules

| Field | Rule |
|---|---|
| Blog title | Required, max 255 chars |
| Blog content | Required, non-empty |
| User name | Required, max 100 chars |
| User bio | Optional, max 500 chars |
| Email | Required, valid format, unique |
| Password | Required, min 8 chars |
| Follow self | Not allowed — return `400` |
| Duplicate bookmark | Not allowed — return `409` |
| Duplicate follow | Not allowed — return `409` |