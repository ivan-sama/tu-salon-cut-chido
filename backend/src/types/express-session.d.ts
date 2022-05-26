import {} from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user:
      | {
          id: number;
          email: string;
          emailValidated: boolean;
          isAdmin: boolean;
          isVerified: boolean;
        }
      | undefined;
  }
}
