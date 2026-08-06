// ─── Skill ───────────────────────────────────────────────

export interface SkillCategory {
  id: string;
  title: string;
}

export interface SkillSubcategory {
  id: string;
  title: string;
  categoryId: string;
}

export type SkillType = 'teach' | 'learn';

export interface Skill {
  id: string;
  title: string;
  description: string;
  type: SkillType;
  subcategoryId: string;
  imageUrl: string | null;
  authorId: string;
  createdAt: string;
  likeCount: number;
}

// ─── User ────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;

  gender: 'female' | 'male';
  age: number;
  city: string;
  description: string;
  createdAt: string;
}

// ─── Request ─────────────────────────────────────────────

export type RequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'inProgress'
  | 'done';

export interface SwapRequest {
  id: string;
  skillId: string;
  fromUserId: string;
  toUserId: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}
