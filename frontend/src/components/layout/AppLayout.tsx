import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: ReactNode;
  showBack?: boolean;
  showHistory?: boolean;
  showNew?: boolean;
  title?: string;
  hideHeader?: boolean;
}

export function AppLayout({
  children,
  showBack = false,
  showHistory = true,
  showNew = false,
  title,
  hideHeader = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && (
        <AppHeader
          showBack={showBack}
          showHistory={showHistory}
          showNew={showNew}
          title={title}
        />
      )}
      <main className="flex-1 mobile-container w-full px-4 py-4 pb-8">
        {children}
      </main>
    </div>
  );
}
