import { Role } from "@/utils/types/user";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  balance: number;
  totalEarnedCoins: number;
  totalRedeemedCoins: number;
}

export type LoginRegisterResponse = {
  token: string;
  user: User;
};

export type VerifyResponse = {
  user: User;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
};
