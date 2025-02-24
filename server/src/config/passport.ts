// src/config/passport.ts
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User, { IUser } from '@/models/user.model';

dotenv.config();

const BaseURL = process.env.BASE_URL || '';

interface IProviderProfile {
  id: string;
  username: string | undefined;
  displayName: string | undefined;
  photos: Array<{ value: string }> | undefined;
  profileUrl: string | undefined;
}

interface IAuthProvider {
  provider: string;
  providerId: string;
  profile?: IProviderProfile;
}

interface IGitHubProfile {
  id: string;
  username?: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  profileUrl?: string;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${BaseURL}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: IGitHubProfile,
      done: (error: Error | null, user?: IUser | false) => void
    ) => {
      try {
        const email = profile.emails?.[0].value?.toLowerCase();

        if (!email) {
          return done(new Error('Email não fornecido pelo GitHub'));
        }

        let user = await User.findOne({
          $or: [
            { 'authProviders.providerId': profile.id },
            { email: email }
          ]
        });

        if (!user) {
          user = new User({
            name: profile.displayName || profile.username,
            email: email,
            roles: ['user'],
            authProviders: [{
              provider: 'github',
              providerId: profile.id,
              profile: {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                photos: profile.photos,
                profileUrl: profile.profileUrl
              }
            }]
          });
        } else {
          const githubProvider = user.authProviders.find(
            (p: IAuthProvider) => p.provider === 'github'
          );

          if (!githubProvider) {
            user.authProviders.push({
              provider: 'github',
              providerId: profile.id,
              profile: {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName,
                photos: profile.photos,
                profileUrl: profile.profileUrl
              }
            });
          }
        }

        user.lastLogin = new Date();
        await user.save();

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

export default passport;
