# Test Cases: Follow System

## TC-FOLLOW-01: Follow a User
- **Requirement:** `POST /follow/:userId` (Auth Required)
- **Objective:** Verify that a user can follow another user.
- **Pre-conditions:** User A and User B exist. User A is logged in.
- **Steps:**
    1. User A sends a POST request to `/follow/User_B_ID`.
- **Expected Result:**
    - Follow relationship is created.
    - Response status code is `201 Created`.

## TC-FOLLOW-02: Prevent Self-Follow
- **Requirement:** `Prevent self-follow at API level; return 400` (Technical Requirements)
- **Objective:** Verify that a user cannot follow themselves.
- **Pre-conditions:** User A is logged in.
- **Steps:**
    1. User A sends a POST request to `/follow/User_A_ID`.
- **Expected Result:**
    - Response status code is `400 Bad Request`.

## TC-FOLLOW-03: Unfollow a User
- **Requirement:** `DELETE /follow/:userId` (Auth Required)
- **Objective:** Verify that a user can unfollow someone they were following.
- **Pre-conditions:** User A is following User B.
- **Steps:**
    1. User A sends a DELETE request to `/follow/User_B_ID`.
- **Expected Result:**
    - Follow relationship is removed.
    - Response status code is `200 OK`.

## TC-FOLLOW-04: View Followers/Following
- **Requirement:** `GET /users/:userId/followers` (Public)
- **Objective:** Verify that follower/following lists are accessible.
- **Steps:**
    1. Send GET request to `/users/User_B_ID/followers`.
    2. Send GET request to `/users/User_B_ID/following`.
- **Expected Result:**
    - Response status code is `200 OK` for both.
    - Correct lists of users are returned.

## TC-FOLLOW-05: Duplicate Follow Prevention
- **Requirement:** `Duplicate follow - Not allowed — return 409` (Validation Rules)
- **Objective:** Verify that a user cannot follow the same person twice.
- **Pre-conditions:** User A is already following User B.
- **Steps:**
    1. User A sends a POST request to `/follow/User_B_ID` again.
- **Expected Result:**
    - Response status code is `409 Conflict`.
