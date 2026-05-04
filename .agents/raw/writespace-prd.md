# Writespace – Product Requirements Document (MVP)

## 🎯 Objective

Writespace is a blogging platform that allows users to write, manage, and explore blogs. The platform ensures public content accessibility while restricting interactions to authenticated users.

---

## 👥 User Roles

### 1. Guest User (Unauthenticated)
- Can browse and read published blogs
- Cannot perform any interaction (follow, bookmark, write)

### 2. Authenticated User
- Has full access to create and manage content
- Can interact with other users and blogs

---

## 🌍 Access Control & Visibility

### Public Access

All published blogs are publicly visible. Anyone can:
- View blog list
- Read full blog content
- View author profiles (basic info + published blogs)

### Restricted Access (Login Required)
- Following users
- Bookmarking blogs
- Creating, editing, deleting blogs
- Accessing drafts

### Behavior Rule

If a guest tries to perform a restricted action:
- System must prompt login
- After login, user is redirected back to the intended action/page

---

## 📌 Core Features

### ✍️ 1. Blog Management (CRUD)

**Description**
Users can create and manage their blogs.

**Functional Requirements**
- Create a blog using a rich text editor
- Edit own blogs
- Delete own blogs
- View all published blogs
- View individual blog details

**Constraints**
- Only the author can edit/delete their blog

---

### 📝 2. Draft System

**Description**
Users can save blogs privately before publishing.

**Functional Requirements**
- Save blog as draft
- Edit draft
- Delete draft
- Publish draft

**Rules**

Drafts are:
- Private
- Only visible to the author

Published blogs become publicly accessible.

---

### 🔖 3. Bookmark System

**Description**
Users can save blogs for later reading.

**Functional Requirements**
- Bookmark any published blog
- Remove bookmarked blog
- View all bookmarked blogs in profile

**Constraints**
- Only authenticated users can bookmark

---

### 👥 4. Follow System

**Description**
Users can follow other users to stay connected.

**Functional Requirements**
- Follow a user
- Unfollow a user
- View followers list
- View following list

**Rules**
- Follow relationship is one-way
- Only authenticated users can follow

---

### 👤 5. User Profile

**Description**
Each user has a personal profile page.

**Functional Requirements**

- View user profile
- Display:
  - User information (name, bio, etc.)
  - User's published blogs
- Access personal sections:
  - Drafts
  - Bookmarked blogs
- Edit own profile

---

### 📖 6. Blog Viewing

**Description**
Users can explore and read blogs.

**Functional Requirements**
- View list of published blogs
- Open and read full blog
- View blog author information

**Access**
- Fully public (no login required)

---

### 🧑‍💻 7. Writing Experience

**Description**
Users create blogs using a rich editor.

**Functional Requirements**

- Write content using editor
- Basic formatting support:
  - Headings
  - Paragraphs
  - Bold / Italic
- Options:
  - Save as draft
  - Publish blog

---

## 🔁 User Flows

### Flow 1: Write Blog
1. User logs in
2. Opens editor
3. Writes content
4. Chooses:
   - Save as draft, OR
   - Publish

### Flow 2: Manage Content
1. User goes to profile
2. Views:
   - Published blogs
   - Drafts
3. Edits or deletes content

### Flow 3: Browse & Read
1. User visits platform
2. Browses blogs
3. Opens and reads blog

### Flow 4: Bookmark Blog
1. User clicks bookmark
2. If not logged in → prompt login
3. After login → blog is bookmarked

### Flow 5: Follow User
1. User visits profile
2. Clicks follow
3. If not logged in → prompt login
4. After login → follow successful

---

## 🚫 Out of Scope (MVP)
- AI features
- Monetization (payments, subscriptions)
- Notifications system
- Recommendation or trending algorithm
- Advanced analytics

---

## ⚡ UX Considerations
- Show login prompt for restricted actions
- Redirect user back after login
- Provide empty states:
  - No blogs
  - No bookmarks
  - No drafts
- Confirmation before deleting content
- Basic validation:
  - Title required
  - Content required

---

## 🧩 Summary

Writespace MVP delivers:
- Public blog reading experience
- Authenticated content creation & management
- Social features (follow, bookmark)
- Draft-based writing workflow
