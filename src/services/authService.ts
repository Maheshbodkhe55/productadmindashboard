import { api } from "./api";
import { User } from "@/types/auth";

export async function login(username: string, password: string) {
  const { data } = await api.post<User>("/auth/login", { username, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}