export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'BARBER' | 'ADMIN';
  loyaltyCount: number;
}

export interface AuthenticationDTO {
  email: string;
  password: string;
}

export interface TokenResponseDTO {
  token: string;
}