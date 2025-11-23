// FIX: Import React to provide the React namespace for types like React.ReactNode.
import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { locales } from '../../i18n'; // Adjust path if needed

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

// Generate static routes for each supported locale (e.g., /en, /tr)
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params: { locale } }: Props) {
  // Receive messages provided in `i18n.ts` for the current locale
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* 
            This would be where the RootProvider and other global components
            from the old app/layout.tsx would go in a real migration.
            For now, we just render children to show the structure.
          */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}