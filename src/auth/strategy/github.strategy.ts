import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import 'dotenv/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
      scope: ['user:email'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  validate(accessToken: string, profile: Profile, done: Function) {
    const { username, displayName, emails, photos } = profile;

    const user = {
      githubId: profile.id,
      username,
      displayName,
      email: emails?.[0]?.value || null,
      picture: photos?.[0]?.value || null,
      accessToken,
    };

    done(null, user);
  }
}
