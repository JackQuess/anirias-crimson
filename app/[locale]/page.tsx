import { useTranslations } from 'next-intl';

export default function Home() {
  // `useTranslations` is for Client Components.
  // For Server Components, you would use: `const t = await getTranslations('Namespace');`
  const t = useTranslations('Navbar');
  const h = useTranslations('Hero');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-anirias-black text-white p-8">
      <h1 className="text-4xl font-cinzel font-bold mb-8">
        Internationalization Demo
      </h1>
      <div className="bg-anirias-void p-6 rounded-lg border border-white/10 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-anirias-crimson">Translated Content:</h2>
        <div className="space-y-2">
          <p>
            <span className="font-bold text-gray-400">Navbar Link:</span> {t('home')}
          </p>
          <p>
            <span className="font-bold text-gray-400">Hero Button:</span> {h('watch')}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          This is a reference page demonstrating `next-intl`. The full application UI is in the main SPA view. Switch languages in the Navbar to see changes.
        </p>
      </div>
    </div>
  );
}
