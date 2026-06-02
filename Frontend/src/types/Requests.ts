import { Gender, PartnerType } from "./Enums";

export interface CreateFamilyTreeRequest {
  name: string;
  isPublic: boolean;
}

export interface UpdateFamilyTreeRequest {
  name: string;
  isPublic: boolean;
}

export interface DeleteFamilyTreeRequest {
  id: number;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  deathDate?: string | null;
  gender: Gender;
  profileImageUrl?: string | null;
  familyTreeId: number;
}

export interface UpdatePersonRequest {
  firstName?: string;
  lastName?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  gender?: Gender;
  profileImageUrl?: string | null;
}

export interface CreateParentChildRequest {
  parentId: number;
  childId: number;
}

export interface CreatePartnerRelationRequest {
  person1Id: number;
  person2Id: number;
  partnerType: PartnerType;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface UpdatePartnerRelationRequest {
  partnerType: PartnerType;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}
