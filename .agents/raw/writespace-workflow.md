# Writespace – Workflow Documentation (MVP)

> Visual workflows for all core user flows, access control logic, and feature interactions.

---

## 🌍 Access Control Flow

```mermaid
flowchart TD
    A([User Visits Writespace]) --> B{Authenticated?}

    B -- No --> C[Guest User]
    B -- Yes --> D[Authenticated User]

    C --> E[Browse Blogs]
    C --> F[Read Full Blog]
    C --> G[View Author Profile]

    C --> H{Tries Restricted Action?}
    H -- Follow / Bookmark / Write --> I[🔒 Prompt Login]
    I --> J[User Logs In]
    J --> K[Redirect Back to Intended Page]
    K --> D

    D --> L[All Guest Permissions]
    D --> M[Create / Edit / Delete Blog]
    D --> N[Save & Manage Drafts]
    D --> O[Bookmark Blogs]
    D --> P[Follow Users]
    D --> Q[Edit Own Profile]
```

---

## ✍️ Flow 1: Write & Publish Blog

```mermaid
flowchart TD
    A([User Logs In]) --> B[Navigate to Editor]
    B --> C[Write Blog Content]
    C --> D[Add Title]
    D --> E{Validate Input}

    E -- Title or Content Missing --> F[⚠️ Show Validation Error]
    F --> C

    E -- Valid --> G{Choose Action}

    G -- Save as Draft --> H[Blog Saved as Draft]
    H --> I[Visible Only to Author]
    H --> J[Accessible in Profile → Drafts]

    G -- Publish --> K[Blog Published]
    K --> L[Publicly Visible]
    K --> M[Listed on Blog Feed]
```

---

## 📝 Flow 2: Manage Content

```mermaid
flowchart TD
    A([User Goes to Profile]) --> B[View Content Sections]

    B --> C[Published Blogs]
    B --> D[Drafts]

    C --> E{Choose Action}
    E -- Edit --> F[Open Blog in Editor]
    F --> G[Update Content]
    G --> H{Save or Republish}
    H -- Save --> I[Changes Published]
    H -- Cancel --> C

    E -- Delete --> J[⚠️ Confirm Deletion]
    J -- Confirm --> K[Blog Deleted]
    J -- Cancel --> C

    D --> L{Choose Action}
    L -- Edit --> M[Open Draft in Editor]
    M --> N{Choose Action}
    N -- Save Draft --> O[Draft Updated]
    N -- Publish --> P[Draft Published]
    N -- Cancel --> D

    L -- Delete --> Q[⚠️ Confirm Deletion]
    Q -- Confirm --> R[Draft Deleted]
    Q -- Cancel --> D
```

---

## 📖 Flow 3: Browse & Read Blog

```mermaid
flowchart TD
    A([User Visits Platform]) --> B[View Published Blog Feed]
    B --> C{Blog Feed Empty?}

    C -- Yes --> D[📭 Show Empty State]
    C -- No --> E[Browse Blog List]

    E --> F[Click on Blog]
    F --> G[View Full Blog Content]
    G --> H[View Author Info]

    H --> I{Authenticated?}
    I -- No --> J[View Author Profile — Read Only]
    I -- Yes --> K[View Author Profile + Follow Option]
```

---

## 🔖 Flow 4: Bookmark Blog

```mermaid
flowchart TD
    A([User Sees a Blog]) --> B[Clicks Bookmark Icon]
    B --> C{Authenticated?}

    C -- No --> D[🔒 Show Login Prompt]
    D --> E[User Logs In]
    E --> F[Redirect Back to Blog]
    F --> G[Blog is Bookmarked ✅]

    C -- Yes --> H{Already Bookmarked?}
    H -- No --> G
    H -- Yes --> I[Remove Bookmark]
    I --> J[Bookmark Removed ✅]

    G --> K[Accessible in Profile → Bookmarks]
    J --> K
```

---

## 👥 Flow 5: Follow a User

```mermaid
flowchart TD
    A([User Visits an Author Profile]) --> B[Clicks Follow Button]
    B --> C{Authenticated?}

    C -- No --> D[🔒 Show Login Prompt]
    D --> E[User Logs In]
    E --> F[Redirect Back to Profile]
    F --> G[Follow Successful ✅]

    C -- Yes --> H{Already Following?}
    H -- No --> G
    H -- Yes --> I[Unfollow User]
    I --> J[Unfollowed ✅]

    G --> K[Appears in Following List]
    G --> L[Author Gains a Follower]
```

---

## 👤 Flow 6: User Profile

```mermaid
flowchart TD
    A([User Navigates to a Profile]) --> B{Own Profile?}

    B -- No --> C[Public View]
    C --> D[See Name & Bio]
    C --> E[See Published Blogs]
    C --> F[Follow / Unfollow Button]

    B -- Yes --> G[Personal Dashboard View]
    G --> H[See Own Info]
    G --> I[Published Blogs Tab]
    G --> J[Drafts Tab]
    G --> K[Bookmarks Tab]
    G --> L[Edit Profile Option]

    L --> M[Update Name / Bio / Info]
    M --> N[Save Changes]
    N --> G
```

---

## 🔐 Authentication Flow

```mermaid
flowchart TD
    A([User Clicks Login / Restricted Action]) --> B[Redirected to Login Page]
    B --> C[Enter Credentials]
    C --> D{Valid Credentials?}

    D -- No --> E[⚠️ Show Error Message]
    E --> C

    D -- Yes --> F{Came from Restricted Action?}
    F -- Yes --> G[Redirect to Intended Page]
    F -- No --> H[Redirect to Home / Feed]

    G --> I[Perform Original Action]
```

---

## 🗺️ Overall System Flow

```mermaid
flowchart TD
    A([Visitor]) --> B{Has Account?}

    B -- No --> C[Browse as Guest]
    C --> D[Read Blogs]
    C --> E[View Profiles]
    C --> F{Wants More?}
    F -- Yes --> G[Sign Up / Log In]
    F -- No --> C

    B -- Yes --> G
    G --> H[Authenticated Session]

    H --> I[Write Blogs]
    H --> J[Manage Drafts]
    H --> K[Bookmark Blogs]
    H --> L[Follow Users]
    H --> M[Edit Profile]

    I --> N{Publish or Draft?}
    N -- Draft --> O[(Draft Store\nPrivate)]
    N -- Publish --> P[(Published Feed\nPublic)]

    P --> D
```

---

## 📊 Feature × Role Matrix

| Feature | Guest | Authenticated |
|---|:---:|:---:|
| Browse blog feed | ✅ | ✅ |
| Read full blog | ✅ | ✅ |
| View author profile | ✅ | ✅ |
| Create blog | ❌ | ✅ |
| Edit own blog | ❌ | ✅ |
| Delete own blog | ❌ | ✅ |
| Save as draft | ❌ | ✅ |
| View own drafts | ❌ | ✅ |
| Publish draft | ❌ | ✅ |
| Bookmark blog | ❌ | ✅ |
| View own bookmarks | ❌ | ✅ |
| Follow a user | ❌ | ✅ |
| Unfollow a user | ❌ | ✅ |
| Edit own profile | ❌ | ✅ |
