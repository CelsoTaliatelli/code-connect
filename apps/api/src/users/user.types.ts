export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}