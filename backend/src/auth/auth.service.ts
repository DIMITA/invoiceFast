import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, User } from './auth.types';

const MOCK_USERS: (User & { password: string })[] = [
  { id: 'user-001', email: 'admin@invoicefast.com', password: 'admin123', name: 'Admin', role: 'admin' },
  { id: 'user-002', email: 'demo@invoicefast.com', password: 'demo123', name: 'Demo User', role: 'user' },
];

@Injectable()
export class AuthService {
  login(dto: LoginDto): AuthResponse {
    const user = MOCK_USERS.find(
      (u) => u.email === dto.email && u.password === dto.password,
    );
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const { password: _, ...userWithoutPassword } = user;
    // Mock token: base64-encoded payload (demo only, not real JWT)
    const payload = Buffer.from(
      JSON.stringify({ sub: user.id, email: user.email, role: user.role, iat: Date.now() }),
    ).toString('base64');
    const token = `mock.${payload}.sig`;

    return { token, user: userWithoutPassword };
  }

  me(token: string): User | null {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const user = MOCK_USERS.find((u) => u.id === payload.sub);
      if (!user) return null;
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      return null;
    }
  }
}
