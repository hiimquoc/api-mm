import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"

// Create a Supabase client with the service role key for admin operations

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 