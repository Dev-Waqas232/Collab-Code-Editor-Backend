import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { type Response } from 'express';
import 'dotenv/config';

import { type AuthRequest } from 'src/types/auth';

import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guards/github-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Get('github')
  @UseGuards(GithubAuthGuard)
  githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  githubCallback(@Req() req: AuthRequest, @Res() res: Response) {
    const token = this.authService.login(req.user);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
}
