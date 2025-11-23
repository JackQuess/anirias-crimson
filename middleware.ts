import createIntlMiddleware from 'next-intl/middleware';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest } from 'next/server';
import { locales } from './i18n';

// 1. Initialize the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'tr',
  localePrefix: 'as-needed' // Only add /en prefix, /tr will be root
});

// 2. Initialize the authentication middleware
const { auth: authMiddleware } = NextAuth(authConfig);

// 3. Chain the middlewares
export default function middleware(req: NextRequest) {
  // First, run the internationalization middleware to handle locale detection.
  // This will rewrite the URL if needed (e.g., from '/' to '/tr').
  const response = intlMiddleware(req);
  
  // Then, run the authentication middleware on the result.
  // This ensures auth checks run on the correctly localized path.
  return authMiddleware(req);
}

export const config = {
  // Match all paths except for static files, API routes, and images.
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
