# Test Cases: Draft System

## TC-DRAFT-01: Save Blog as Draft
- **Requirement:** `status = draft` (Technical Requirements)
- **Objective:** Verify that a user can save a blog without publishing it.
- **Pre-conditions:** User is logged in.
- **Steps:**
    1. Send a POST request to `/blogs` with:
        - `title`: "Work in Progress"
        - `content`: "Thinking about..."
        - `status`: "draft"
- **Expected Result:**
    - Blog is saved with `status = draft`.
    - Response status code is `201 Created`.
    - Blog DOES NOT appear in public feed (`GET /blogs`).

## TC-DRAFT-02: View Own Drafts
- **Requirement:** `GET /blogs/drafts` (Auth Required)
- **Objective:** Verify that a user can see their own drafts.
- **Pre-conditions:** User A has 2 drafts.
- **Steps:**
    1. User A sends a GET request to `/blogs/drafts`.
- **Expected Result:**
    - Response status code is `200 OK`.
    - Both drafts are returned in the list.

## TC-DRAFT-03: Draft Privacy
- **Requirement:** `Drafts must never appear in public blog feed` (Technical Requirements)
- **Objective:** Verify that drafts are private to the author.
- **Pre-conditions:** User A has a draft `draft_456`. User B is logged in.
- **Steps:**
    1. User B sends a GET request to `/blogs/drafts`.
    2. Guest user sends a GET request to `/blogs/drafts`.
    3. Guest user tries to GET `/blogs/draft_456`.
- **Expected Result:**
    - User B's list does NOT contain `draft_456`.
    - Guest user receives `401 Unauthorized` for drafts list.
    - GET single draft by guest/other user returns `404 Not Found` or `403 Forbidden`.

## TC-DRAFT-04: Publish a Draft
- **Requirement:** `PUT /blogs/:id/publish` (Technical Requirements)
- **Objective:** Verify that a draft can be transitioned to published status.
- **Pre-conditions:** User A has a draft `draft_456`.
- **Steps:**
    1. User A sends a PUT request to `/blogs/draft_456/publish`.
- **Expected Result:**
    - Blog status changes to `published`.
    - Response status code is `200 OK`.
    - Blog now appears in public feed.
