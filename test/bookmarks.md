# Test Cases: Bookmark System

## TC-BOOK-01: Bookmark a Blog
- **Requirement:** `POST /bookmarks/:blogId` (Auth Required)
- **Objective:** Verify that an authenticated user can bookmark a blog.
- **Pre-conditions:** User is logged in. Published blog `blog_123` exists.
- **Steps:**
    1. Send a POST request to `/bookmarks/blog_123`.
- **Expected Result:**
    - Bookmark is created in the database.
    - Response status code is `201 Created`.

## TC-BOOK-02: Duplicate Bookmark Prevention
- **Requirement:** `Unique constraint on (user_id, blog_id)` (Technical Requirements)
- **Objective:** Verify that a user cannot bookmark the same blog twice.
- **Pre-conditions:** User has already bookmarked `blog_123`.
- **Steps:**
    1. Send a POST request to `/bookmarks/blog_123` again.
- **Expected Result:**
    - Response status code is `409 Conflict`.

## TC-BOOK-03: Remove a Bookmark
- **Requirement:** `DELETE /bookmarks/:blogId` (Auth Required)
- **Objective:** Verify that a user can remove a bookmark.
- **Pre-conditions:** User has bookmarked `blog_123`.
- **Steps:**
    1. Send a DELETE request to `/bookmarks/blog_123`.
- **Expected Result:**
    - Bookmark is removed from the database.
    - Response status code is `200 OK`.

## TC-BOOK-04: View Own Bookmarks
- **Requirement:** `GET /bookmarks` (Auth Required)
- **Objective:** Verify that a user can view their list of bookmarked blogs.
- **Pre-conditions:** User has 3 bookmarks.
- **Steps:**
    1. Send a GET request to `/bookmarks`.
- **Expected Result:**
    - Response status code is `200 OK`.
    - List of 3 bookmarked blog objects is returned.

## TC-BOOK-05: Bookmark Guest Access
- **Requirement:** `If guest tries to perform a restricted action: System must prompt login` (PRD)
- **Objective:** Verify that guests cannot bookmark blogs.
- **Steps:**
    1. Guest user sends a POST request to `/bookmarks/blog_123`.
- **Expected Result:**
    - Response status code is `401 Unauthorized`.
