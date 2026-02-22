export type User = {
  id: number;
  userName: string;
  email: string | null;
  roles: string[];
}

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}