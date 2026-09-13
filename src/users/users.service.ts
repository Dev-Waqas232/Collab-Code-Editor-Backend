import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserPayload } from 'src/types/user';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createProfile(user: CreateUserPayload) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) return existingUser;

    const newUser = await this.prisma.user.create({
      data: {
        githubId: user.githubId,
        authProvider: user.authProvider,
        name: user.name!,
        email: user.email!,
        avatarUrl: user.avatarUrl,
      },
    });

    return newUser;
  }
}
