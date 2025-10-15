export interface UserType {
  name: string;
  email: string;
  teste: string;
  password: string;
  is_admin: boolean;
  allowed_create_meeting: boolean;
  allowed_edit_minutes: boolean;
}

export interface Institution {
  id: number;
  name: string;
  address: string;
  acronym: string;
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
  status?: string;
  deletedAt?: string | null;
  is_admin?: boolean;
  institution?: Institution;
  llowed_edit_minutes?: boolean;
  allowed_create_meetin?: boolean;
}

export interface UseGetUsuarioParams {
  page?: number;
  query?: string | null;
  supervisorId?: number | null;
  position?: number | null;
  managerId?: number | null;
  pageNumber?: number | null,
  pageSize?: number | null,
  disablePagination?: boolean | null,
  includeDeleted?: boolean | null
}
