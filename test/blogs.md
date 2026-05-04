# Test Cases: Blog Management (CRUD)

## TC-BLOG-01: Create a Published Blog
- **Requirement:** `POST /blogs` (Technical Requirements)
- **Objective:** Verify that an authenticated user can create and publish a blog.
- **Pre-conditions:** User is logged in.
- **Steps:**
    1. Send a POST request to `/blogs` with:
        - `title`: "My First Blog"
        - `content`: "Hello world!"
        - `status`: "published"
- **Expected Result:**
    - Blog is saved with `status = published`.
    - Response status code is `201 Created`.
    - Blog appears in public feed (`GET /blogs`).

## TC-BLOG-02: Create Blog with Missing Fields
- **Requirement:** `Title and content fields are required` (Technical Requirements)
- **Objective:** Verify that blog creation fails if title or content is missing.
- **Pre-conditions:** User is logged in.
- **Steps:**
    1. Send a POST request to `/blogs` with empty title.
    2. Send a POST request to `/blogs` with empty content.
- **Expected Result:**
    - Response status code is `400 Bad Request`.

## TC-BLOG-03: Update Own Blog
- **Requirement:** `PUT /blogs/:id` (Author Only)
- **Objective:** Verify that an author can update their own blog.
- **Pre-conditions:** User A has a published blog with ID `blog_123`.
- **Steps:**
    1. User A sends a PUT request to `/blogs/blog_123` with updated title and content.
- **Expected Result:**
    - Blog is updated in the database.
    - Response status code is `200 OK`.

## TC-BLOG-04: Update Someone Else's Blog
- **Requirement:** `Only the author can edit/delete their blog` (PRD)
- **Objective:** Verify that a user cannot update a blog they did not author.
- **Pre-conditions:** User A has a blog `blog_123`. User B is logged in.
- **Steps:**
    1. User B sends a PUT request to `/blogs/blog_123` with new content.
- **Expected Result:**
    - Response status code is `403 Forbidden` (or `401` depending on middleware implementation, usually 403 for authorization).

## TC-BLOG-05: Delete Own Blog
- **Requirement:** `DELETE /blogs/:id` (Author Only)
- **Objective:** Verify that an author can delete their own blog.
- **Pre-conditions:** User A has a blog `blog_123`.
- **Steps:**
    1. User A sends a DELETE request to `/blogs/blog_123`.
- **Expected Result:**
    - Blog is removed or soft-deleted.
    - Response status code is `200 OK` or `204 No Content`.

## TC-BLOG-06: Public Access to Blogs
- **Requirement:** `GET /blogs` and `GET /blogs/:id` (Public)
- **Objective:** Verify that guest users can view published blogs.
- **Steps:**
    1. Send GET request to `/blogs` without auth token.
    2. Send GET request to `/blogs/blog_123` (published) without auth token.
- **Expected Result:**
    - Both requests succeed with `200 OK`.
    - Blog content is returned.
