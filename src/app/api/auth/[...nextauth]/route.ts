import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for admin operations
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const { data: existingUser } = await adminSupabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (!existingUser) {
            // Create new user if doesn't exist
            const { data: newUser, error } = await adminSupabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  name: user.name,
                  avatar_url: user.image,
                  provider: 'google',
                  provider_id: user.id,
                },
              ])
              .select()
              .single();

            if (error) {
              console.error('Error creating user:', error);
              return false;
            }

            // Store both NextAuth and Supabase user IDs
            user.id = newUser.id;
            user.supabaseUserId = newUser.id;
          } else {
            // Store both NextAuth and Supabase user IDs
            user.id = existingUser.id;
            user.supabaseUserId = existingUser.id;
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.supabaseUserId = user.supabaseUserId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.supabaseUserId = token.supabaseUserId as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST }; 