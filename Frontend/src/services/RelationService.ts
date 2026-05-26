import { apiFetch } from "./Api";
import type { ParentChildRelation, PartnerRelation } from "../types/Models";
import type {
  CreateParentChildRequest,
  CreatePartnerRelationRequest,
  UpdatePartnerRelationRequest,
} from "../types/Requests";

// ── Förälder-barn ────────────────────────────────────────────

// GET /api/relations/parent-child/tree/:familyTreeId
export function getParentChildRelationsByTree(
  familyTreeId: number,
): Promise<ParentChildRelation[]> {
  return apiFetch<ParentChildRelation[]>(
    `/api/relations/parent-child/tree/${familyTreeId}`,
  );
}

// POST /api/relations/parent-child
export function createParentChildRelation(
  data: CreateParentChildRequest,
): Promise<ParentChildRelation> {
  return apiFetch<ParentChildRelation>("/api/relations/parent-child", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// DELETE /api/relations/parent-child/:id
export function deleteParentChildRelation(id: number): Promise<null> {
  return apiFetch<null>(`/api/relations/parent-child/${id}`, {
    method: "DELETE",
  });
}

// ── Partner ──────────────────────────────────────────────────

// GET /api/relations/partner/:personId
export function getPartnerRelations(
  personId: number,
): Promise<PartnerRelation[]> {
  return apiFetch<PartnerRelation[]>(`/api/relations/partner/${personId}`);
}

// POST /api/relations/partner
export function createPartnerRelation(
  data: CreatePartnerRelationRequest,
): Promise<PartnerRelation> {
  return apiFetch<PartnerRelation>("/api/relations/partner", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /api/relations/partner/:id
export function updatePartnerRelation(
  id: number,
  data: UpdatePartnerRelationRequest,
): Promise<PartnerRelation> {
  return apiFetch<PartnerRelation>(`/api/relations/partner/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /api/relations/partner/:id
export function deletePartnerRelation(id: number): Promise<null> {
  return apiFetch<null>(`/api/relations/partner/${id}`, { method: "DELETE" });
}
