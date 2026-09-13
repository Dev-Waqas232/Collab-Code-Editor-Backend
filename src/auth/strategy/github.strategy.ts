/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import 'dotenv/config';
import { UsersService } from 'src/users/users.service';
import { CreateUserPayload } from 'src/types/user';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function,
  ) {
    const { displayName, emails, photos } = profile;

    const data: Partial<CreateUserPayload> = {
      githubId: profile.id,
      name: displayName,
      email: emails?.[0]?.value,
      avatarUrl: photos?.[0]?.value || null,
      authProvider: 'github',
    };

    const user = await this.userService.createProfile(data);

    done(null, user);
  }
}
