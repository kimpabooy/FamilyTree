import { apiFetch } from "./Api";
import type { FamilyTree } from "../types/Models";
import type {
  CreateFamilyTreeRequest,
  UpdateFamilyTreeRequest,
} from "../types/Requests";

// GET /api/familytree
export function getFamilyTrees(): Promise<FamilyTree[]> {
  return apiFetch<FamilyTree[]>("/api/familytree");
}

// GET /api/familytree/:id
export function getFamilyTree(id: number): Promise<FamilyTree> {
  return apiFetch<FamilyTree>(`/api/familytree/${id}`);
}

// POST /api/familytree
export function createFamilyTree(
  data: CreateFamilyTreeRequest,
): Promise<FamilyTree> {
  return apiFetch<FamilyTree>("/api/familytree", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /api/familytree/:id
export function updateFamilyTree(
  id: number,
  data: UpdateFamilyTreeRequest,
): Promise<FamilyTree> {
  return apiFetch<FamilyTree>(`/api/familytree/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /api/familytree/:id
export function deleteFamilyTree(id: number): Promise<null> {
  return apiFetch<null>(`/api/familytree/${id}`, { method: "DELETE" });
}
