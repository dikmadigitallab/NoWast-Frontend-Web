interface UserType {
  name: string;
  email: string;
  teste: string;
  password: string;
  is_admin: boolean;
  allowed_create_meeting: boolean;
  allowed_edit_minutes: boolean;
}
interface Institution {
  id: number;
  name: string;
  address: string;
  acronym: string;
}

interface User {
  id?: number;
  name?: string;
  email?: string;
  is_admin?: boolean;
  institution?: Institution;
  llowed_edit_minutes?: boolean;
  allowed_create_meetin?: boolean;
}
