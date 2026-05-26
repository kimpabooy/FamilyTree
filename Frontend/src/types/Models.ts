import { Gender, PartnerType } from "./Enums";

export interface FamilyTree {
  id: number;
  name: string;
  isPublic: boolean;
  ownerId: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  deathDate: string | null;
  gender: Gender;
  profileImageUrl: string | null;
  familyTreeId: number;
  createdDate: string;
  updatedDate: string | null;
}

export interface PartnerRelation {
  id: number;
  partnerType: PartnerType;
  fromDate: string | null;
  toDate: string | null;
  createdDate: string;
  updatedDate: string | null;
  partner: Person;
}

export interface ParentChildRelation {
  id: number;
  parentId: number;
  childId: number;
  createdDate: string;
}

export interface PersonFamily {
  person: Person | null;
  parents: Person[] | null;
  children: Person[] | null;
  siblings: Person[] | null;
  grandparents: Person[] | null;
  partners: PartnerRelation[] | null;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  displayName: string;
}
