
import React from 'react';
// import { usePathname } from 'next/navigation'; // In Next.js 14
import Navbar from '../Navbar';
import MobileNavigation from '../MobileNavigation';
import Footer from '../Footer';
import { ViewState } from '../../types'; // Mock type for this demo

interface SiteLayoutProps {
  children: React.ReactNode;
  // Props below are for the demo App.tsx context, normally just children in Next.js
  currentView?: ViewState;
  onNavigate?: (view: ViewState) => void;
}

export function SiteLayout({ children, currentView, onNavigate }: SiteLayoutProps) {
  // const pathname = usePathname();
  
  // In a real Next.js app:
  // const isAdmin = pathname?.startsWith('/admin');
  // const isAuth = pathname === '/login' || pathname === '/register';

  // In this Mock App.tsx context:
  const isAdmin = currentView && [
    ViewState.ADMIN_DASHBOARD,
    ViewState.ADMIN_ANIME,
    ViewState.ADMIN_IMPORT,
    ViewState.ADMIN_USERS,
    ViewState.ADMIN_REPORTS,
    ViewState.ADMIN_SYSTEM,
    ViewState.ADMIN_SETTINGS
  ].includes(currentView);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Hide on Admin */}
      {!isAdmin && onNavigate && (
        <Navbar 
          onLogoClick={() => onNavigate(ViewState.HOME)} 
          onNavigate={onNavigate}
          onOpenAuth={() => {}} // Placeholder, managed in App.tsx
          onOpenCommand={() => {}} // Placeholder
        />
      )}

      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Nav - Hide on Admin */}
      {!isAdmin && onNavigate && currentView && (
        <MobileNavigation currentView={currentView} onNavigate={onNavigate} />
      )}

      {/* Footer - Hide on Admin */}
      {!isAdmin && <Footer />}
    </div>
  );
}
