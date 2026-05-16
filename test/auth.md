# Test Cases: Authentication & Registration

## TC-AUTH-01: Successful User Registration
- **Requirement:** `POST /auth/register` (Technical Requirements)
- **Objective:** Verify that a new user can register successfully with valid credentials.
- **Pre-conditions:** None.
- **Steps:**
    1. Send a POST request to `/auth/register` with:
        - `name`: "John Doe"
        - `email`: "john@example.com"
        - `password`: "password123"
- **Expected Result:**
    - User is created in the database.
    - Response status code is `201 Created`.
    - Response contains user details (excluding password).

## TC-AUTH-02: Registration with Existing Email
- **Requirement:** `Email: Required, valid format, unique` (Validation Rules)
- **Objective:** Verify that registration fails if the email is already in use.
- **Pre-conditions:** A user with email `john@example.com` already exists.
- **Steps:**
    1. Send a POST request to `/auth/register` with:
        - `name`: "Jane Doe"
        - `email`: "john@example.com"
        - `password`: "securePassword123"
- **Expected Result:**
    - Response status code is `409 Conflict`.
    - Error message indicating email is already taken.

## TC-AUTH-03: Registration with Invalid Data
- **Requirement:** Validation Rules (Name, Email, Password)
- **Objective:** Verify that registration fails with invalid or missing fields.
- **Steps:**
    1. Send POST to `/auth/register` with missing `name`.
    2. Send POST to `/auth/register` with invalid `email` format.
    3. Send POST to `/auth/register` with `password` < 8 characters.
- **Expected Result:**
    - Response status code is `400 Bad Request` for each case.
    - Response contains validation error details.

## TC-AUTH-04: Successful User Login
- **Requirement:** `POST /auth/login` (Technical Requirements)
- **Objective:** Verify that an existing user can log in and receive a token.
- **Pre-conditions:** User `john@example.com` exists with password `password123`.
- **Steps:**
    1. Send a POST request to `/auth/login` with:
        - `email`: "john@example.com"
        - `password`: "password123"
- **Expected Result:**
    - Response status code is `200 OK`.
    - Response contains a valid authentication token (JWT).

## TC-AUTH-05: Login with Invalid Credentials
- **Requirement:** Auth Flow (Technical Requirements)
- **Objective:** Verify that login fails with incorrect email or password.
- **Steps:**
    1. Send a POST request to `/auth/login` with correct email but wrong password.
    2. Send a POST request to `/auth/login` with non-existent email.
- **Expected Result:**
    - Response status code is `401 Unauthorized`.
    - Error message indicating invalid credentials.

## TC-AUTH-06: Access Restricted Route Without Auth
- **Requirement:** Access Control Rule (PRD / Workflow)
- **Objective:** Verify that guest users are blocked from restricted routes.
- **Steps:**
    1. Send a GET request to `/blogs/drafts` without an auth token.
- **Expected Result:**
    - Response status code is `401 Unauthorized`.
    - System prompts/redirects to login (API returns 401).
