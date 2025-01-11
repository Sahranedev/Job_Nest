export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  age: number;
  role: string;
  createdAt: string; // Date sous forme de chaîne (ex: ISO 8601)
  updatedAt: string; // Date sous forme de chaîne (ex: ISO 8601)
  city: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
