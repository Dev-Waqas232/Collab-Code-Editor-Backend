import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) return null;

    return user;
  }

  login(user: Pick<User, 'email' | 'id'>) {
    const payload: JwtPayload = { email: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }
}
