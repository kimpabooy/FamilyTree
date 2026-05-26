import { apiFetch } from "./Api";
import type { Person, PersonFamily } from "../types/Models";
import type {
  CreatePersonRequest,
  UpdatePersonRequest,
} from "../types/Requests";

// GET /api/person/tree/:familyTreeId
export function getPersonsByTree(familyTreeId: number): Promise<Person[]> {
  return apiFetch<Person[]>(`/api/person/tree/${familyTreeId}`);
}

// GET /api/person/:id
export function getPerson(id: number): Promise<Person> {
  return apiFetch<Person>(`/api/person/${id}`);
}

// GET /api/person/:id/family
export function getPersonFamily(id: number): Promise<PersonFamily> {
  return apiFetch<PersonFamily>(`/api/person/${id}/family`);
}

// POST /api/person
export function createPerson(data: CreatePersonRequest): Promise<Person> {
  return apiFetch<Person>("/api/person", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /api/person/:id
export function updatePerson(
  id: number,
  data: UpdatePersonRequest,
): Promise<Person> {
  return apiFetch<Person>(`/api/person/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /api/person/:id
export function deletePerson(id: number): Promise<null> {
  return apiFetch<null>(`/api/person/${id}`, { method: "DELETE" });
}
