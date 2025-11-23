
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { UserRank } from './types';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // Required for Credentials provider with Database
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    // 1. JWT Callback: Called whenever a token is created/updated.
    // We use this to stuff DB fields into the token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // In a real app, TypeScript would infer this from the Prisma User model.
        // We cast here assuming the schema matches our types.ts
        (token as any).role = (user as any).role || 'USER';
        (token as any).rank = (user as any).rank || 'Pawn';
      }
      return token;
    },
    // 2. Session Callback: Called whenever the client checks the session.
    // We map the token fields to the session object.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token as any).role;
        (session.user as any).rank = (token as any).rank;
      }
      return session;
    },
  },
});
