export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOGS: '/blogs',
  BLOG_NEW: '/blogs/new',
  BLOG_DETAIL: '/blogs/:id',
  BLOG_EDIT: '/blogs/:id/edit',
  BLOG_DRAFTS: '/blogs/drafts',
  USER_PROFILE: '/users/:userId',
  USER_FOLLOWERS: '/users/:userId/followers',
  USER_FOLLOWING: '/users/:userId/following',
  EDIT_PROFILE: '/profile/edit',
} as const;
