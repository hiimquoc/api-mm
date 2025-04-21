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
            const { error } = await adminSupabase.from('users').insert([
              {
                email: user.email,
                name: user.name,
                avatar_url: user.image,
                provider: 'google',
                provider_id: user.id,
              },
            ]);

            if (error) {
              console.error('Error creating user:', error);
              return false;
            }
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST }; 