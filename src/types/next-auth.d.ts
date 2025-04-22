// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    supabaseUserId: string;
  }

  interface Session {
    user: User & {
      id: string;
      supabaseUserId: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    supabaseUserId: string;
  }
} 