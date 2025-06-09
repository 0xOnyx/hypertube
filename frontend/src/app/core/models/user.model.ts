export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
  token: string;
} 