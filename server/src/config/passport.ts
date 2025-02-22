// src/config/passport.ts
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

interface GitHubStrategyConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

interface GitHubProfile {
  id: string;
  displayName: string;
  username?: string;
  emails?: Array<{ value: string }>;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: 'http://localhost:5000/api/auth/github/callback',
    } as GitHubStrategyConfig,
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: Error | null, user?: any) => void
    ) => {
      try {
        return done(null, profile);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);
