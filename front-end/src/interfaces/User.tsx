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
  createdAt: string;
  updatedAt: string;
  city: string;
  cv_path: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
