import { Request } from 'express';
import { User } from 'src/generated/prisma/client';

export interface AuthRequest extends Request {
  user: Pick<User, 'email' | 'id'>;
}

export type JwtPayload = {
  email: string;
  sub: string;
};
