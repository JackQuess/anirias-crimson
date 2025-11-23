import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'tr'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
      // In a real app, you'd probably want to redirect or show a 404.
      // For this setup, we'll default to 'tr'.
      locale = 'tr';
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
