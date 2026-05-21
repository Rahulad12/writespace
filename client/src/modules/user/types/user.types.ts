export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  created_at: string;
  published_blog_count: number;
}

export interface UserProfileWithFollow extends UserProfile {
  is_following: boolean;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
}

export interface FollowWithProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  created_at: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
}

export interface UserProfileWithFollowResponse {
  profile: UserProfileWithFollow;
}

export interface FollowListResponse {
  followers?: FollowWithProfile[];
  following?: FollowWithProfile[];
}

export interface FollowStatusResponse {
  following: boolean;
}

export interface UpdateProfileResponse {
  message: string;
  profile: UserProfile;
}
