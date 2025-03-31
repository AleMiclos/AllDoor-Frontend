export interface User {
  name: string;
  email: string;
  role: string;
  permissions: {
    totens: boolean;
    tvs: boolean;
  };
}
