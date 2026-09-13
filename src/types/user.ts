import { User } from 'src/generated/prisma/client';

export type CreateUserPayload = Partial<Omit<User, 'createdAt' | 'updatedAt'>>;
