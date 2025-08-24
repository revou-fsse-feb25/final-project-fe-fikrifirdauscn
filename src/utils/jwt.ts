import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  iat: number;
  exp: number;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}