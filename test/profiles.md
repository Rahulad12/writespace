# Test Cases: User Profile

## TC-PROFILE-01: View Public Profile (Guest)
- **Requirement:** `GET /users/:userId` — Public profile (Technical Requirements)
- **Objective:** Verify what a guest sees when viewing a profile.
- **Steps:**
    1. Guest sends a GET request to `/users/User_A_ID`.
- **Expected Result:**
    - Response status code is `200 OK`.
    - Response contains: `name`, `bio`, `published blogs`.
    - Response DOES NOT contain: `drafts`, `bookmarks`.

## TC-PROFILE-02: View Own Profile (Authenticated)
- **Requirement:** `Profile response for own user includes: drafts count, bookmarks count` (Technical Requirements)
- **Objective:** Verify that a user sees more info on their own profile.
- **Pre-conditions:** User A is logged in.
- **Steps:**
    1. User A sends a GET request to `/users/User_A_ID` or `/users/me`.
- **Expected Result:**
    - Response status code is `200 OK`.
    - Response contains: `name`, `bio`, `published blogs`, `drafts count`, `bookmarks count`.

## TC-PROFILE-03: Update Own Profile
- **Requirement:** `PUT /users/me` — Update own profile (Technical Requirements)
- **Objective:** Verify that a user can update their name and bio.
- **Pre-conditions:** User is logged in.
- **Steps:**
    1. Send a PUT request to `/users/me` with new `name` and `bio`.
- **Expected Result:**
    - Profile is updated in the database.
    - Response status code is `200 OK`.

## TC-PROFILE-04: Update Profile Validation
- **Requirement:** `Validate bio length and name on update; return 400` (Technical Requirements)
- **Objective:** Verify validation rules for profile updates.
- **Steps:**
    1. Send PUT request with `name` > 100 chars.
    2. Send PUT request with `bio` > 500 chars.
- **Expected Result:**
    - Response status code is `400 Bad Request`.
