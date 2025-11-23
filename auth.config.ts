
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // Added later in auth.ts to avoid Edge runtime issues with certain libs
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPanel = nextUrl.pathname.startsWith('/admin');
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');

      // 1. Protect Admin Routes
      if (isOnAdminPanel) {
        if (isLoggedIn) {
          // Check Role
          if (auth.user.role === 'ADMIN') return true;
          // Redirect non-admins to home
          return Response.redirect(new URL('/', nextUrl));
        }
        // Redirect unauthenticated to login
        return false;
      }

      // 2. Redirect Logged-in users away from Login page
      if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
