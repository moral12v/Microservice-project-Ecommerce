export interface CreateAdminDTO {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  language?: string;
  currentPassword: string;
  newPassword: string;
}

export interface UpdateAdminDTO {
  userName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  language?: string;
  currentPassword?: string;
  newPassword?: string;
}
