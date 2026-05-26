import { apiFetch } from "./Api";
import type { AuthResponse } from "../types/Models";
import type { LoginRequest, RegisterRequest } from "../types/Requests";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", response.token);
  localStorage.setItem("userId", response.userId);

  return response;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", response.token);
  localStorage.setItem("userId", response.userId);

  return response;
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem("userId");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}
