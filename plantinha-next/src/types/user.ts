export type UserRole = "ADMIN";

export interface AdminUserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
