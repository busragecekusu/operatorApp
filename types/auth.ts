export interface LoginPayload {
  id: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  operatorId?: string;
  sellerId?: string;
  role?: string;
  phoneNumber?: string;
  companyName?: string;
  taxNumber?: string;
  address?: string;
  isActive?: boolean;
  companyId?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  dbdDocument?: File | string | null;
  tatLicence?: File | string | null;
  type: string;
}
